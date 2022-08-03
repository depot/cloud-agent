import {Instance, Volume} from '@aws-sdk/client-ec2'
import {compare} from 'fast-json-patch'
import {Dispatcher, request} from 'undici'
import {StateRequest, StateResponse} from '../types'
import {CLOUD_AGENT_API_TOKEN, CLOUD_AGENT_API_URL, CLOUD_AGENT_CONNECTION_ID, CLOUD_AGENT_VERSION} from '../utils/env'

const headers = {
  Authorization: `Bearer ${CLOUD_AGENT_API_TOKEN}`,
  'User-Agent': `cloud-agent/${CLOUD_AGENT_VERSION}`,
  'Content-Type': 'application/json',
}

const id = CLOUD_AGENT_CONNECTION_ID

export async function getDesiredState(): Promise<StateResponse> {
  const res = await request(`${CLOUD_AGENT_API_URL}/connections/${id}/desired-state`, {headers})
  const data = await res.body.json()
  return data
}

export async function reportErrors(errors: string[]): Promise<void> {
  if (errors.length === 0) return
  const body = JSON.stringify({errors})
  await request(`${CLOUD_AGENT_API_URL}/connections/${id}/errors`, {method: 'POST', headers, body})
}

interface StateCache {
  etag: string
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
    const res = await request(`${CLOUD_AGENT_API_URL}/connections/${id}/state`, {
      method: 'PATCH',
      headers: {...headers, 'If-Match': stateCache.etag},
      body: JSON.stringify(diff),
    })
    if (res.statusCode < 400) {
      stateCache.state = current
      stateCache.etag = getETag(res)
      return
    }
  }

  const res = await request(`${CLOUD_AGENT_API_URL}/connections/${id}/state`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(current),
  })
  if (res.statusCode < 400) {
    stateCache = {state: current, etag: getETag(res)}
    return
  }

  throw new Error(`Failed to report state: ${res.statusCode} ${await res.body.text()}`)
}

function getETag(res: Dispatcher.ResponseData): string {
  const etag = res.headers.etag
  if (!etag) throw new Error('No ETag')
  return etag
}

function toPlainObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}
