import {Readable} from 'node:stream'
import * as zlib from 'node:zlib'
import {request} from 'undici'
import {StateResponse} from '../types'
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
  'Content-Encoding': 'br',
}

const id = CLOUD_AGENT_CONNECTION_ID

export async function getDesiredState(currentState: any): Promise<StateResponse> {
  const body = Readable.from(JSON.stringify(currentState))
  const compressed = body.pipe(zlib.createBrotliCompress())
  const res = await request(`${CLOUD_AGENT_API_ENDPOINT}/${id}/state`, {method: 'POST', headers, body: compressed})
  const data = await res.body.json()
  return data
}
