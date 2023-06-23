import {PlainMessage} from '@bufbuild/protobuf'
import {
  AuthorizeClientAction,
  CreateClientAction,
  CreateVolumeAction,
  DeleteClientAction,
  DeleteVolumeAction,
  ReconcileVolumesResponse,
  ReportVolumeUpdatesRequest,
  ResizeVolumeAction,
} from '../proto/depot/cloud/v2/cloud_pb'
import {
  authCaps,
  authGetKey,
  authRm,
  cephConfig,
  createAuthEntity,
  createBlockDevice,
  createNamespace,
  imageRm,
  namespaceRm,
  newClientName,
  newImageSpec,
  newOsdProfile,
  newPoolSpec,
} from '../utils/ceph'
import {reportError} from '../utils/errors'
import {client} from '../utils/grpc'

export async function startVolumeStream(signal: AbortSignal) {
  while (!signal.aborted) {
    try {
      const stream = client.reconcileVolumes({}, {signal})
      for await (const response of stream) {
        if (signal.aborted) return

        try {
          const update = await handleAction(response.action)
          if (update) await client.reportVolumeUpdates(update)
        } catch (err: any) {
          await reportError(err)
        }
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
    case 'resizeVolume':
      return await resizeVolume(action.value)
    case 'deleteVolume':
      return await deleteVolume(action.value)
    case 'createClient':
      return await createClient(action.value)
    case 'authorizeClient':
      return await authorizeClient(action.value)
    case 'deleteClient':
      return await deleteClient(action.value)
    default:
      return null
  }
}

async function createVolume({volumeName, size}: CreateVolumeAction): Promise<PlainMessage<ReportVolumeUpdatesRequest>> {
  const poolSpec = newPoolSpec(volumeName)
  const imageSpec = newImageSpec(volumeName)

  await createNamespace(poolSpec)
  await createBlockDevice(imageSpec, size)

  return {
    update: {
      case: 'createVolume',
      value: {
        volumeName,
      },
    },
  }
}

async function resizeVolume(_action: ResizeVolumeAction) {
  // TODO: resize volume
  return null
}

async function deleteVolume({volumeName}: DeleteVolumeAction): Promise<PlainMessage<ReportVolumeUpdatesRequest>> {
  const imageSpec = newImageSpec(volumeName)
  const poolSpec = newPoolSpec(volumeName)
  await imageRm(imageSpec)
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
