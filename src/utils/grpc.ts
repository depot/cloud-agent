import {createPromiseClient, Interceptor} from '@connectrpc/connect'
import {createConnectTransport, Http2SessionManager} from '@connectrpc/connect-node'
import {CloudService} from '../proto/depot/cloud/v4/cloud_connect'
import {CLOUD_AGENT_API_URL, CLOUD_AGENT_CONNECTION_TOKEN, CLOUD_AGENT_VERSION} from './env'

const headerInterceptor: Interceptor = (next) => async (req) => {
  req.header.set('Authorization', `Bearer ${CLOUD_AGENT_CONNECTION_TOKEN}`)
  req.header.set('User-Agent', `cloud-agent/${CLOUD_AGENT_VERSION}`)
  return await next(req)
}

export function createClient() {
  const sessionManager = new Http2SessionManager(CLOUD_AGENT_API_URL, {
    pingIntervalMs: 1000 * 60, // 1 minute
    idleConnectionTimeoutMs: 1000 * 60 * 10, // 10 minutes
  })

  const transport = createConnectTransport({
    httpVersion: '2',
    baseUrl: CLOUD_AGENT_API_URL,
    interceptors: [headerInterceptor],
    sessionManager,
  })

  return createPromiseClient(CloudService, transport)
}

export let client = createClient()

export function recreateClient() {
  client = createClient()
}
