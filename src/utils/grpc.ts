import {createPromiseClient, Interceptor} from '@bufbuild/connect'
import {createConnectTransport} from '@bufbuild/connect-node'
import {CloudService} from '../proto/depot/cloud/v2/cloud_connect'
import {CLOUD_AGENT_API_URL, CLOUD_AGENT_VERSION} from './env'

const userAgentInterceptor: Interceptor = (next) => async (req) => {
  req.header.set('User-Agent', `cloud-agent/${CLOUD_AGENT_VERSION}`)
  return await next(req)
}

const transport = createConnectTransport({
  httpVersion: '2',
  baseUrl: CLOUD_AGENT_API_URL,
  interceptors: [userAgentInterceptor],
})

export const client = createPromiseClient(CloudService, transport)
