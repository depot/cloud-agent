import {request} from 'undici'
import {CLOUD_AGENT_CONNECTION_ID, CLOUD_AGENT_VERSION, DEPOT_API_ENDPOINT, DEPOT_API_TOKEN} from './env'

const commonHeaders = {
  Authorization: `Bearer ${DEPOT_API_TOKEN}`,
  'User-Agent': `cloud-agent/${CLOUD_AGENT_VERSION}`,
  'Content-Type': 'application/json',
}

export async function pingHealth() {
  await request(`${DEPOT_API_ENDPOINT}/api/agents/cloud/${CLOUD_AGENT_CONNECTION_ID}/health`, {
    method: 'POST',
    headers: commonHeaders,
  })
}

export async function getDesiredState() {
  const res = await request(`${DEPOT_API_ENDPOINT}/api/agents/cloud/${CLOUD_AGENT_CONNECTION_ID}/desired-state`, {
    method: 'POST',
    headers: commonHeaders,
  })
  const body = await res.body.json()
  return body
}

export async function reportCurrentState(state: any) {
  const res = await request(`${DEPOT_API_ENDPOINT}/api/agents/cloud/${CLOUD_AGENT_CONNECTION_ID}/current-state`, {
    method: 'POST',
    headers: commonHeaders,
    body: JSON.stringify(state),
  })
  const body = await res.body.json()
  return body
}
