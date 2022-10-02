import {Instance, Volume} from '@aws-sdk/client-ec2'
import {compare} from 'fast-json-patch'
import {GetDesiredStateResponse} from '../proto/depot/cloud/v1/cloud'
import {StateRequest} from '../types'
import {CONNECTION_ID} from '../utils/env'
import {client} from '../utils/grpc'

const connectionId = CONNECTION_ID

export async function getDesiredState(): Promise<GetDesiredStateResponse> {
  return await client.getDesiredState({connectionId})
}

export async function reportErrors(errors: string[]): Promise<void> {
  if (errors.length === 0) return
  try {
    await client.setLastErrors({connectionId, errors})
  } catch (err) {
    console.error('Error reporting errors:', err)
  }
}

interface StateCache {
  generation: number
  state: {
    cloud: StateRequest['cloud']
    availabilityZone: StateRequest['availabilityZone']
    instances: Record<string, Instance>
    volumes: Record<string, Volume>
  }
}

let stateCache: StateCache | null = null

export async function reportState(state: StateRequest): Promise<void> {
  const current: StateCache['state'] = toPlainObject({
    cloud: state.cloud,
    availabilityZone: state.availabilityZone,
    instances: state.instances.reduce((acc, instance) => {
      if (!instance.InstanceId) return acc
      acc[instance.InstanceId] = instance
      return acc
    }, {} as Record<string, Instance>),
    volumes: state.volumes.reduce((acc, volume) => {
      if (!volume.VolumeId) return acc
      acc[volume.VolumeId] = volume
      return acc
    }, {} as Record<string, Volume>),
  })

  if (stateCache) {
    const diff = compare(stateCache.state, current)
    try {
      const res = await client.patchCloudState({
        connectionId,
        patch: {
          generation: stateCache.generation,
          patch: {
            $case: 'aws',
            aws: {patch: JSON.stringify(diff)},
          },
        },
      })
      stateCache.state = current
      stateCache.generation = res.generation
      return
    } catch {}
  }

  const res = await client.replaceCloudState({
    connectionId,
    state: {
      state: {
        $case: 'aws',
        aws: {availabilityZone: current.availabilityZone, state: JSON.stringify(current)},
      },
    },
  })
  stateCache = {state: current, generation: res.generation}
}

function toPlainObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}
