import {createChannel, createClient, Metadata} from 'nice-grpc'
import {CloudServiceClient, CloudServiceDefinition} from '../proto/depot/cloud/v1/cloud'
import {API_URL, CONNECTION_TOKEN, TF_MODULE_VERSION} from './env'

const channel = createChannel(API_URL)

export const client: CloudServiceClient = createClient(CloudServiceDefinition, channel, {
  '*': {
    metadata: Metadata({
      Authorization: `Bearer ${CONNECTION_TOKEN}`,
      'User-Agent': `cloud-agent/${TF_MODULE_VERSION}`,
    }),
  },
})
