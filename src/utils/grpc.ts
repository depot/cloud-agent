import {createPromiseClient, Interceptor} from '@bufbuild/connect'
import {createGrpcTransport} from '@bufbuild/connect-node'
import {CloudService} from '../proto/depot/cloud/v2/cloud_connect'
import {CLOUD_AGENT_API_URL, CLOUD_AGENT_CONNECTION_TOKEN, CLOUD_AGENT_VERSION} from './env'

const authInterceptor: Interceptor = (next) => async (req) => {
  console.log(`sending message to ${req.url}`)
  req.header.set('Authorization', `Bearer ${CLOUD_AGENT_CONNECTION_TOKEN}`)
  req.header.set('User-Agent', `cloud-agent/${CLOUD_AGENT_VERSION}`)
  return await next(req)
}

const transport = createGrpcTransport({
  baseUrl: CLOUD_AGENT_API_URL,
  httpVersion: '2',
  interceptors: [authInterceptor],
})

export const client = createPromiseClient(CloudService, transport)
