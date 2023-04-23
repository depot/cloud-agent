import {createChannel, createClient, Metadata} from 'nice-grpc'
import {CloudServiceClient, CloudServiceDefinition} from '../proto/depot/cloud/v3/cloud'
import {CLOUD_AGENT_API_URL, CLOUD_AGENT_CONNECTION_TOKEN, CLOUD_AGENT_VERSION} from './env'

const channel = createChannel(CLOUD_AGENT_API_URL)

export const client: CloudServiceClient = createClient(CloudServiceDefinition, channel, {
  '*': {
    metadata: Metadata({
      Authorization: `Bearer ${CLOUD_AGENT_CONNECTION_TOKEN}`,
      'User-Agent': `cloud-agent/${CLOUD_AGENT_VERSION}`,
    }),
  },
})
