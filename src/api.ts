import {request} from 'undici'
import {CLOUD_AGENT_API_ENDPOINT, CLOUD_AGENT_API_TOKEN, CLOUD_AGENT_CONNECTION_ID, CLOUD_AGENT_VERSION} from './env'
import {StateResponse} from './types'

const headers = {
  Authorization: `Bearer ${CLOUD_AGENT_API_TOKEN}`,
  'User-Agent': `cloud-agent/${CLOUD_AGENT_VERSION}`,
  'Content-Type': 'application/json',
}

const id = CLOUD_AGENT_CONNECTION_ID

export async function getDesiredState(currentState: any): Promise<StateResponse> {
  const body = JSON.stringify(currentState)
  const res = await request(`${CLOUD_AGENT_API_ENDPOINT}/${id}/state`, {method: 'POST', headers, body})
  const data = await res.body.json()
  return data
}
