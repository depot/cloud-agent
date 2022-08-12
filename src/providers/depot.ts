import {Instance, Volume} from '@aws-sdk/client-ec2'
import {compare} from 'fast-json-patch'
import * as cloud from '../proto/depot/cloud/v1/cloud.pb'
import {StateRequest} from '../types'
import {CLOUD_AGENT_CONNECTION_ID, CLOUD_AGENT_CONNECTION_TOKEN, CLOUD_AGENT_TF_MODULE_VERSION} from '../utils/env'
import {rpcTransport} from '../utils/rpc'

const headers = {
  Authorization: `Bearer ${CLOUD_AGENT_CONNECTION_TOKEN}`,
  'User-Agent': `cloud-agent/${CLOUD_AGENT_TF_MODULE_VERSION}`,
  'Content-Type': 'application/json',
}

const connectionId = CLOUD_AGENT_CONNECTION_ID

export async function getDesiredState(): Promise<cloud.GetDesiredStateResponse> {
  return await cloud.GetDesiredState({connectionId}, rpcTransport)
}

export async function reportErrors(errors: string[]): Promise<void> {
  if (errors.length === 0) return
  try {
    await cloud.SetLastErrors({connectionId, errors}, rpcTransport)
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
      const res = await cloud.PatchCloudState(
        {connectionId, patch: {generation: stateCache.generation, aws: {patch: JSON.stringify(diff)}}},
        rpcTransport,
      )
      stateCache.state = current
      stateCache.generation = res.generation
      return
    } catch {}
  }

  const res = await cloud.ReplaceCloudState(
    {connectionId, state: {aws: {availabilityZone: current.availabilityZone, state: JSON.stringify(current)}}},
    rpcTransport,
  )
  stateCache = {state: current, generation: res.generation}
}

function toPlainObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}
