import {CreateVolumeCommand, RunInstancesCommand} from '@aws-sdk/client-ec2'
import {
  GetCreateStreamResponse,
  GetCreateStreamResponse_Architecture,
  GetCreateStreamResponse_SecurityGroup,
} from '../proto/depot/cloud/v3/cloud'
import {ec2} from '../utils/aws'
import {
  CLOUD_AGENT_AWS_SG_BUILDKIT,
  CLOUD_AGENT_AWS_SG_DEFAULT,
  CLOUD_AGENT_AWS_SUBNET_ID,
  CLOUD_AGENT_CONNECTION_ID,
} from '../utils/env'
import {reportError} from '../utils/errors'
import {client} from '../utils/grpc'

export async function startHandleCreateStream(signal: AbortSignal) {
  while (!signal.aborted) {
    try {
      const stream = client.getCreateStream({}, {signal})

      for await (const response of stream) {
        await createResource(response)
      }
    } catch (err: any) {
      await reportError(err)
    }
  }
}

async function createResource(response: GetCreateStreamResponse): Promise<void> {
  const {resource} = response
  if (!resource) return

  switch (resource?.$case) {
    case 'machine': {
      const {machine} = resource
      await ec2.send(
        new RunInstancesCommand({
          LaunchTemplate: {
            LaunchTemplateId:
              machine.architecture === GetCreateStreamResponse_Architecture.ARCHITECTURE_X86_64
                ? process.env.CLOUD_AGENT_AWS_LAUNCH_TEMPLATE_X86
                : process.env.CLOUD_AGENT_AWS_LAUNCH_TEMPLATE_ARM,
          },
          ImageId: machine.image,
          TagSpecifications: [
            {
              ResourceType: 'instance',
              Tags: [
                {Key: 'Name', Value: `depot-connection-${CLOUD_AGENT_CONNECTION_ID}-${machine.requestId}`},
                {Key: 'depot-connection', Value: CLOUD_AGENT_CONNECTION_ID},
              ],
            },
          ],
          NetworkInterfaces: [
            {
              DeviceIndex: 0,
              AssociatePublicIpAddress: true,
              Groups: [
                machine.securityGroup === GetCreateStreamResponse_SecurityGroup.SECURITY_GROUP_BUILDKIT
                  ? CLOUD_AGENT_AWS_SG_BUILDKIT
                  : CLOUD_AGENT_AWS_SG_DEFAULT,
              ],
              SubnetId: CLOUD_AGENT_AWS_SUBNET_ID,
            },
          ],
          MaxCount: 1,
          MinCount: 1,
        }),
      )
      break
    }

    case 'volume': {
      const {volume} = resource
      await ec2.send(
        new CreateVolumeCommand({
          AvailabilityZone: process.env.CLOUD_AGENT_AWS_AVAILABILITY_ZONE,
          Encrypted: true,
          Size: volume.size,
          TagSpecifications: [
            {
              ResourceType: 'volume',
              Tags: [
                {Key: 'Name', Value: `depot-connection-${CLOUD_AGENT_CONNECTION_ID}-${volume.requestId}`},
                {Key: 'depot-connection', Value: CLOUD_AGENT_CONNECTION_ID},
              ],
            },
          ],
          VolumeType: 'gp3',
        }),
      )
      break
    }

    default:
      throw new Error('Unknown resource type')
  }
}
