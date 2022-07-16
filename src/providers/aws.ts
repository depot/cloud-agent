import {
  AttachVolumeCommand,
  CreateVolumeCommand,
  DeleteVolumeCommand,
  DescribeInstancesCommand,
  DescribeVolumesCommand,
  DetachVolumeCommand,
  EC2Client,
  RunInstancesCommand,
  StartInstancesCommand,
  StopInstancesCommand,
  TerminateInstancesCommand,
} from '@aws-sdk/client-ec2'
import {VolumeStatus} from '../types'
import {promises} from '../utils'
import {CLOUD_AGENT_CONNECTION_ID} from '../utils/env'
import {getDesiredState} from './depot'

const client = new EC2Client({})

/** Filter to select only Depot-managed resources */
const tagFilter = {Name: 'tag:depot-connection', Values: [CLOUD_AGENT_CONNECTION_ID]}

/** Queries for all managed instances */
export async function getInstancesState() {
  const res = await client.send(new DescribeInstancesCommand({Filters: [tagFilter]}))
  return res.Reservations?.flatMap((r) => r.Instances || []) || []
}

/** Queries for all managed volumes */
export async function getVolumesState() {
  const res = await client.send(new DescribeVolumesCommand({Filters: [tagFilter]}))
  return res.Volumes || []
}

export async function reconcile(errors: string[]) {
  const state = await promises({
    cloud: 'aws',
    availabilityZone: process.env.AWS_AVAILABILITY_ZONE,
    instances: getInstancesState(),
    volumes: getVolumesState(),
    errors,
  })

  const nextState = await getDesiredState(state)

  for (const volume of nextState.newVolumes) {
    const existing = state.volumes.find((v) =>
      v.Tags?.some((t) => t.Key === 'depot-volume-id' && t.Value === volume.id),
    )
    if (existing) continue

    await client.send(
      new CreateVolumeCommand({
        AvailabilityZone: process.env.AWS_AVAILABILITY_ZONE,
        Encrypted: true,
        Size: volume.size,
        TagSpecifications: [
          {
            ResourceType: 'volume',
            Tags: [
              {Key: 'Name', Value: `depot-connection-${CLOUD_AGENT_CONNECTION_ID}-${volume.id}`},
              {Key: 'depot-connection', Value: CLOUD_AGENT_CONNECTION_ID},
              {Key: 'depot-volume-id', Value: volume.id},
            ],
          },
        ],
        VolumeType: 'gp3',
      }),
    )
  }

  for (const volume of nextState.volumes) {
    const current = state.volumes.find((x) => x.VolumeId === volume.volumeID)
    const currentState = (current?.State ?? 'unknown') as VolumeStatus | 'unknown'

    // Skip if already at the desired state
    if (currentState === volume.desiredState) continue

    if (currentState === 'error') continue

    if (volume.desiredState === 'in-use') {
      if (currentState === 'creating') continue
      if (currentState === 'deleting' || currentState === 'deleted') continue
      await client.send(
        new AttachVolumeCommand({Device: volume.device, InstanceId: volume.attachedTo, VolumeId: volume.volumeID}),
      )
    }

    if (volume.desiredState === 'available') {
      if (currentState === 'creating') continue
      if (currentState === 'deleting' || currentState === 'deleted') continue
      await client.send(new DetachVolumeCommand({VolumeId: volume.volumeID}))
    }

    if (volume.desiredState === 'deleted') {
      if (currentState === 'deleting') continue
      if (currentState === 'creating' || currentState === 'in-use') continue
      await client.send(new DeleteVolumeCommand({VolumeId: volume.volumeID}))
    }
  }

  for (const instance of nextState.newInstances) {
    const existing = state.instances.find((i) =>
      i.Tags?.some((t) => t.Key === 'depot-machine-id' && t.Value === instance.id),
    )
    if (existing) continue

    await client.send(
      new RunInstancesCommand({
        LaunchTemplate: {
          LaunchTemplateId:
            instance.architecture === 'x86' ? process.env.LAUNCH_TEMPLATE_X86 : process.env.LAUNCH_TEMPLATE_ARM,
        },
        ImageId: instance.ami,
        TagSpecifications: [
          {
            ResourceType: 'instance',
            Tags: [
              {Key: 'Name', Value: `depot-connection-${CLOUD_AGENT_CONNECTION_ID}-${instance.id}`},
              {Key: 'depot-connection', Value: CLOUD_AGENT_CONNECTION_ID},
              {Key: 'depot-machine-id', Value: instance.id},
            ],
          },
        ],
        MaxCount: 1,
        MinCount: 1,
      }),
    )
  }

  for (const instance of nextState.instances) {
    const current = state.instances.find((x) => x.InstanceId === instance.instanceID)
    const currentState = current?.State?.Name ?? 'unknown'

    // Skip if already at the desired state
    if (currentState === instance.desiredState) continue

    if (instance.desiredState === 'running') {
      if (currentState === 'pending') continue
      if (currentState === 'shutting-down' || currentState === 'terminated' || currentState === 'stopping') continue
      await client.send(new StartInstancesCommand({InstanceIds: [instance.instanceID]}))
    }

    if (instance.desiredState === 'stopped') {
      if (currentState === 'stopping') continue
      if (currentState === 'shutting-down' || currentState === 'terminated') continue
      await client.send(new StopInstancesCommand({InstanceIds: [instance.instanceID]}))
    }

    if (instance.desiredState === 'terminated') {
      if (currentState === 'shutting-down') continue
      if (currentState === 'pending' || currentState === 'stopping') continue
      await client.send(new TerminateInstancesCommand({InstanceIds: [instance.instanceID]}))
    }
  }
}
