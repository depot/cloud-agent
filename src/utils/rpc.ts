import {ClientConfiguration} from 'twirpscript'
import {fetch} from 'undici'
import {CLOUD_AGENT_CONNECTION_TOKEN, CLOUD_AGENT_TF_MODULE_VERSION} from './env'

export const rpcTransport: ClientConfiguration = {
  baseURL: 'https://cloud.depot.dev',
  prefix: '/rpc',
  headers: {
    Authorization: `Bearer ${CLOUD_AGENT_CONNECTION_TOKEN}`,
    'User-Agent': `cloud-agent/${CLOUD_AGENT_TF_MODULE_VERSION}`,
  },
  rpcTransport: (a, b) => fetch(a, b),
}
