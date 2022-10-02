import {Instance, Volume} from '@aws-sdk/client-ec2'
import {compare} from 'fast-json-patch'
import {GetDesiredStateResponse} from '../proto/depot/cloud/v1/cloud'
import {AWSStateRequest, FlyStateRequest, StateRequest} from '../types'
import {CONNECTION_ID} from '../utils/env'
import * as fly from '../utils/flyClient'
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
    availabilityZone: AWSStateRequest['availabilityZone']
    region: FlyStateRequest['region']
    instances: Record<string, object>
    machines: Record<string, object>
    volumes: Record<string, object>
  }
}

let stateCache: StateCache | null = null

export async function reportState(state: StateRequest): Promise<void> {
  const current: StateCache['state'] =
    state.cloud === 'aws'
      ? toPlainObject({
          cloud: state.cloud,
          availabilityZone: state.availabilityZone,
          region: '',
          instances: state.instances.reduce((acc, instance) => {
            if (!instance.InstanceId) return acc
            acc[instance.InstanceId] = instance
            return acc
          }, {} as Record<string, Instance>),
          machines: {},
          volumes: state.volumes.reduce((acc, volume) => {
            if (!volume.VolumeId) return acc
            acc[volume.VolumeId] = volume
            return acc
          }, {} as Record<string, Volume>),
        })
      : toPlainObject({
          cloud: state.cloud,
          availabilityZone: '',
          region: state.region,
          instances: {},
          machines: state.machines.reduce((acc, machine) => {
            if (!machine.id) return acc
            acc[machine.id] = machine
            return acc
          }, {} as Record<string, fly.V1Machine>),
          volumes: state.volumes.reduce((acc, volume) => {
            if (!volume.id) return acc
            acc[volume.id] = volume
            return acc
          }, {} as Record<string, fly.Volume>),
        })

  if (stateCache) {
    const diff = compare(stateCache.state, current)
    try {
      const res = await client.patchCloudState({
        connectionId,
        patch: {
          generation: stateCache.generation,
          patch:
            state.cloud === 'aws'
              ? {
                  $case: state.cloud,
                  aws: {patch: JSON.stringify(diff)},
                }
              : {
                  $case: state.cloud,
                  fly: {patch: JSON.stringify(diff)},
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
      state:
        state.cloud === 'aws'
          ? {
              $case: state.cloud,
              aws: {availabilityZone: current.availabilityZone, state: JSON.stringify(current)},
            }
          : {
              $case: state.cloud,
              fly: {region: current.region, state: JSON.stringify(current)},
            },
    },
  })
  stateCache = {state: current, generation: res.generation}
}

function toPlainObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}
