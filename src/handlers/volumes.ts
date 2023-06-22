import {
  AuthorizeClientAction,
  CreateClientAction,
  CreateVolumeAction,
  DeleteClientAction,
  DeleteVolumeAction,
  ResizeVolumeAction,
} from '../proto/depot/cloud/v2/cloud_pb'
import {
  authCaps,
  authGetJson,
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
import {CLOUD_AGENT_CONNECTION_ID} from '../utils/env'
import {reportError} from '../utils/errors'
import {client} from '../utils/grpc'

export async function startVolumeStream(signal: AbortSignal) {
  while (!signal.aborted) {
    try {
      const stream = client.reconcileVolumes({connectionId: CLOUD_AGENT_CONNECTION_ID}, {signal})
      for await (const response of stream) {
        if (signal.aborted) return
        switch (response.action.case) {
          case 'createVolume':
            await createVolume(response.action.value)
            break
          case 'resizeVolume':
            await resizeVolume(response.action.value)
            break
          case 'deleteVolume':
            await deleteVolume(response.action.value)
            break
          case 'createClient':
            await createClient(response.action.value)
            break
          case 'authorizeClient':
            await authorizeClient(response.action.value)
            break
          case 'deleteClient':
            await deleteClient(response.action.value)
            break
        }
      }
    } catch (err: any) {
      await reportError(err)
    }
  }
}

async function createVolume({volumeName, size}: CreateVolumeAction) {
  const poolSpec = newPoolSpec(volumeName)
  const imageSpec = newImageSpec(volumeName)

  try {
    await createNamespace(poolSpec)
    await createBlockDevice(imageSpec, size)

    await client.reportVolumeUpdates({
      update: {
        case: 'createVolume',
        value: {
          volumeName,
        },
      },
    })
  } catch (err: any) {
    await reportError(err)
  }
}

async function resizeVolume(_action: ResizeVolumeAction) {
  // TODO: resize volume
}

async function deleteVolume({volumeName}: DeleteVolumeAction) {
  const imageSpec = newImageSpec(volumeName)
  const poolSpec = newPoolSpec(volumeName)

  try {
    await imageRm(imageSpec)
    await namespaceRm(poolSpec)

    await client.reportVolumeUpdates({
      update: {
        case: 'deleteVolume',
        value: {
          volumeName,
        },
      },
    })
  } catch (err: any) {
    await reportError(err)
  }
}

async function createClient({machineName}: CreateClientAction) {
  const clientName = newClientName(machineName)
  try {
    await createAuthEntity(clientName)

    await client.reportVolumeUpdates({
      update: {
        case: 'createClient',
        value: {
          machineName,
          clientName,
        },
      },
    })
  } catch (err: any) {
    await reportError(err)
  }
}

async function authorizeClient({volumeName, clientName}: AuthorizeClientAction) {
  const osdProfile = newOsdProfile(volumeName)

  try {
    await authCaps(osdProfile, clientName)
    const {key} = await authGetJson(clientName)
    const config = await cephConfig()

    await client.reportVolumeUpdates({
      update: {
        case: 'authorizeClient',
        value: {
          clientName,
          volumeName,
          key,
          config,
          imageSpec: newImageSpec(volumeName),
        },
      },
    })
  } catch (err: any) {
    await reportError(err)
  }
}

async function deleteClient({clientName}: DeleteClientAction) {
  try {
    await authRm(clientName)

    await client.reportVolumeUpdates({
      update: {
        case: 'deleteClient',
        value: {
          clientName,
        },
      },
    })
  } catch (err: any) {
    await reportError(err)
  }
}
