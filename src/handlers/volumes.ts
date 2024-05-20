import {PlainMessage} from '@bufbuild/protobuf'
import {
  AuthorizeClientAction,
  CopyVolumeAction,
  CopyVolumeAction_Kind,
  CopyVolumeUpdate_Kind,
  CreateClientAction,
  CreateVolumeAction,
  DeleteClientAction,
  DeleteVolumeAction,
  ReconcileVolumesResponse,
  ReportVolumeUpdatesRequest,
  ResizeVolumeAction,
  TrimVolumeAction,
} from '../proto/depot/cloud/v2/cloud_pb'
import {
  authCaps,
  authGetKey,
  authRm,
  cephConfig,
  createAuthEntity,
  createBlockDevice,
  createClone,
  createNamespace,
  createSnapshot,
  enableCephMetrics,
  imageRm,
  namespaceRm,
  newClientName,
  newCloneSpec,
  newImageSpec,
  newOsdProfile,
  newPoolSpec,
  newSnapshotSpec,
  snapshotFromImageSpec,
  snapshotRm,
  sparsify,
} from '../utils/ceph'
import {reportError} from '../utils/errors'
import {client} from '../utils/grpc'

export async function startVolumeStream(signal: AbortSignal) {
  while (!signal.aborted) {
    try {
      const inProgressUpdates: Record<string, boolean> = {}
      const completedUpdates: Record<string, boolean> = {}

      const stream = client.reconcileVolumes({}, {signal})

      for await (const response of stream) {
        if (signal.aborted) return
        ;(async () => {
          const actionKey = JSON.stringify(response.action)
          if (inProgressUpdates[actionKey] || completedUpdates[actionKey]) return
          try {
            inProgressUpdates[actionKey] = true
            const update = await handleAction(response.action)
            if (update) await client.reportVolumeUpdates(update)
            completedUpdates[actionKey] = true
            setTimeout(() => {
              delete completedUpdates[actionKey]
            }, 30 * 1000)
          } catch (err: any) {
            await reportError(err)
          } finally {
            delete inProgressUpdates[actionKey]
          }
        })()
      }
    } catch (err: any) {
      await reportError(err)
    }
  }
}

async function handleAction(
  action: ReconcileVolumesResponse['action'],
): Promise<PlainMessage<ReportVolumeUpdatesRequest> | null> {
  switch (action.case) {
    case 'createVolume':
      return await createVolume(action.value)
    case 'copyVolume':
      return await copyVolume(action.value)
    case 'resizeVolume':
      return await resizeVolume(action.value)
    case 'trimVolume':
      return await trimVolume(action.value)
    case 'deleteVolume':
      return await deleteVolume(action.value)
    case 'createClient':
      return await createClient(action.value)
    case 'authorizeClient':
      return await authorizeClient(action.value)
    case 'deleteClient':
      return await deleteClient(action.value)
    default:
      console.log('Unknown action', action)
      return null
  }
}

async function createVolume({volumeName, size}: CreateVolumeAction): Promise<PlainMessage<ReportVolumeUpdatesRequest>> {
  const poolSpec = newPoolSpec(volumeName)
  const imageSpec = newImageSpec(volumeName)

  await createNamespace(poolSpec)
  await createBlockDevice(imageSpec, size)
  try {
    await enableCephMetrics()
  } catch (err: any) {
    console.warn('failed to enable ceph metrics', err)
  }

  return {
    update: {
      case: 'createVolume',
      value: {
        volumeName,
        imageSpec,
      },
    },
  }
}

async function copyVolume({
  volumeName,
  parentImageSpec,
  kind,
}: CopyVolumeAction): Promise<PlainMessage<ReportVolumeUpdatesRequest> | null> {
  switch (kind) {
    case CopyVolumeAction_Kind.SNAPSHOT:
      return await snapshotVolume(volumeName, parentImageSpec)
    case CopyVolumeAction_Kind.CLONE:
      return await cloneVolume(volumeName, parentImageSpec)
    default:
      console.log('Unknown copy volume kind', kind)
      return null
  }
}

async function snapshotVolume(
  volumeName: string,
  parentImage: string,
): Promise<PlainMessage<ReportVolumeUpdatesRequest>> {
  const parentImageSpec = newImageSpec(parentImage)
  const snapshotSpec = snapshotFromImageSpec(parentImageSpec, volumeName)
  await createSnapshot(snapshotSpec)
  console.log('Created snapshot', snapshotSpec)

  return {
    update: {
      case: 'copyVolume',
      value: {
        kind: CopyVolumeUpdate_Kind.SNAPSHOT,
        volumeName,
        imageSpec: snapshotSpec,
        parentImageSpec,
      },
    },
  }
}

async function cloneVolume(
  volumeName: string,
  parentImageSpec: string,
): Promise<PlainMessage<ReportVolumeUpdatesRequest> | null> {
  // PRECONDITION: parent name is a snapshot name with the `@` symbol.
  if (!parentImageSpec.includes('@')) {
    console.error(`Invalid snapshot name: ${parentImageSpec}`)
    return null
  }
  const [snapshotParentName] = parentImageSpec.split('@')
  const snapshotSpec = newSnapshotSpec(parentImageSpec)

  const cloneSpec = newCloneSpec(newPoolSpec(snapshotParentName), volumeName)
  await createClone(snapshotSpec, cloneSpec)

  return {
    update: {
      case: 'copyVolume',
      value: {
        kind: CopyVolumeUpdate_Kind.CLONE,
        volumeName,
        imageSpec: cloneSpec,
        parentImageSpec,
      },
    },
  }
}

async function resizeVolume(_action: ResizeVolumeAction) {
  // TODO: resize volume
  return null
}

let isSparsifyInProgress = false

// Only one sparsify operation can be in progress at a time to make sure we do not overload Ceph.
async function trimVolume({volumeName}: TrimVolumeAction): Promise<PlainMessage<ReportVolumeUpdatesRequest> | null> {
  if (isSparsifyInProgress) return null
  isSparsifyInProgress = true

  try {
    const imageSpec = newImageSpec(volumeName)
    const completed = await sparsify(imageSpec)
    if (!completed) return null

    return {
      update: {
        case: 'trimVolume',
        value: {
          volumeName,
        },
      },
    }
  } finally {
    isSparsifyInProgress = false
  }
}

async function deleteVolume({
  volumeName,
  imageSpec,
}: DeleteVolumeAction): Promise<PlainMessage<ReportVolumeUpdatesRequest> | null> {
  if (imageSpec) {
    if (imageSpec.includes('@')) {
      const snapshotSpec = newSnapshotSpec(imageSpec)
      await snapshotRm(snapshotSpec)
      return {
        update: {
          case: 'deleteVolume',
          value: {
            volumeName,
          },
        },
      }
    }
    await imageRm(newImageSpec(imageSpec))
  } else {
    await imageRm(newImageSpec(volumeName))
  }

  const poolSpec = newPoolSpec(volumeName)
  await namespaceRm(poolSpec)

  return {
    update: {
      case: 'deleteVolume',
      value: {
        volumeName,
      },
    },
  }
}

async function createClient({
  clientName: plainClientName,
}: CreateClientAction): Promise<PlainMessage<ReportVolumeUpdatesRequest>> {
  const clientName = newClientName(plainClientName)
  await createAuthEntity(clientName)
  const {key} = await authGetKey(clientName)
  const config = await cephConfig()

  return {
    update: {
      case: 'createClient',
      value: {
        clientName,
        key,
        config,
      },
    },
  }
}

async function authorizeClient({
  volumeName,
  clientName: plainClientName,
  imageSpec,
}: AuthorizeClientAction): Promise<PlainMessage<ReportVolumeUpdatesRequest>> {
  const osdProfile = newOsdProfile(volumeName)
  const clientName = newClientName(plainClientName)
  await authCaps(osdProfile, clientName)

  return {
    update: {
      case: 'authorizeClient',
      value: {
        clientName,
        volumeName,
        imageSpec,
      },
    },
  }
}

async function deleteClient({
  clientName: plainClientName,
}: DeleteClientAction): Promise<PlainMessage<ReportVolumeUpdatesRequest>> {
  const clientName = newClientName(plainClientName)
  await authRm(clientName)

  return {
    update: {
      case: 'deleteClient',
      value: {
        clientName,
      },
    },
  }
}
