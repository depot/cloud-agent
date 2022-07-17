import {Instance, Volume} from '@aws-sdk/client-ec2'
import {compare} from 'fast-json-patch'
import {Readable} from 'node:stream'
import * as zlib from 'node:zlib'
import {Dispatcher, request} from 'undici'
import {StateRequest, StateResponse} from '../types'
import {
  CLOUD_AGENT_API_ENDPOINT,
  CLOUD_AGENT_API_TOKEN,
  CLOUD_AGENT_CONNECTION_ID,
  CLOUD_AGENT_VERSION,
} from '../utils/env'

const headers = {
  Authorization: `Bearer ${CLOUD_AGENT_API_TOKEN}`,
  'User-Agent': `cloud-agent/${CLOUD_AGENT_VERSION}`,
  'Content-Type': 'application/json',
}

const id = CLOUD_AGENT_CONNECTION_ID

export async function getDesiredState(currentState: StateRequest): Promise<StateResponse> {
  const report = reportState(currentState)

  const body = Readable.from(JSON.stringify(currentState))
  const compressed = body.pipe(zlib.createBrotliCompress())
  const res = await request(`${CLOUD_AGENT_API_ENDPOINT}/${id}/state`, {
    method: 'POST',
    headers: {...headers, 'Content-Encoding': 'br'},
    body: compressed,
  })
  const data = await res.body.json()

  await report

  return data
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
    const res = await request(`https://cloud.depot.dev/connection/${id}`, {
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

  const res = await request(`https://cloud.depot.dev/connection/${id}`, {
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
