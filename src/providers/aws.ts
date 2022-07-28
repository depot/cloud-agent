import {
  AttachVolumeCommand,
  CreateVolumeCommand,
  DeleteVolumeCommand,
  DescribeInstancesCommand,
  DescribeVolumesCommand,
  DetachVolumeCommand,
  EC2Client,
  Instance,
  RunInstancesCommand,
  StartInstancesCommand,
  StopInstancesCommand,
  TerminateInstancesCommand,
  Volume,
} from '@aws-sdk/client-ec2'
import {
  InstanceDesiredState,
  NewInstanceDesiredState,
  NewVolumeDesiredState,
  VolumeDesiredState,
  VolumeStatus,
} from '../types'
import {promises} from '../utils'
import {
  CLOUD_AGENT_CONNECTION_ID,
  CLOUD_AGENT_SG_CLOSED,
  CLOUD_AGENT_SG_OPEN,
  CLOUD_AGENT_SUBNET_ID,
} from '../utils/env'
import {getDesiredState, reportState} from './depot'

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

export async function reconcile(): Promise<string[]> {
  const state = await promises({
    cloud: 'aws',
    availabilityZone: process.env.AWS_AVAILABILITY_ZONE ?? 'unknown',
    instances: getInstancesState(),
    volumes: getVolumesState(),
    errors: [],
  })

  await reportState(state)
  const nextState = await getDesiredState()

  const results = await Promise.allSettled([
    ...nextState.newVolumes.map((volume) => reconcileNewVolume(state.volumes, volume)),
    ...nextState.volumes.map((volume) => reconcileVolume(state.volumes, volume)),
    ...nextState.newInstances.map((instance) => reconcileNewInstance(state.instances, instance)),
    ...nextState.instances.map((instance) => reconcileInstance(state.instances, instance)),
  ])

  return results
    .map((r) => (r.status === 'rejected' ? `${r.reason}` : undefined))
    .filter((r): r is string => r !== undefined)
}

async function reconcileNewVolume(state: Volume[], volume: NewVolumeDesiredState) {
  const existing = state.find((v) => v.Tags?.some((t) => t.Key === 'depot-volume-id' && t.Value === volume.id))
  if (existing) return

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

async function reconcileVolume(state: Volume[], volume: VolumeDesiredState) {
  const current = state.find((x) => x.VolumeId === volume.volumeID)
  const currentState = (current?.State ?? 'unknown') as VolumeStatus | 'unknown'
  const currentAttachment = current?.Attachments?.[0]?.InstanceId

  // Skip if already at the desired state and attached to the correct machine
  if (currentState === volume.desiredState && volume.desiredState !== 'in-use') return
  if (currentState === volume.desiredState && currentAttachment === volume.attachedTo) return

  if (currentState === 'error') return

  if (volume.desiredState === 'in-use') {
    if (currentState === 'creating') return
    if (currentState === 'deleting' || currentState === 'deleted') return

    if (currentState === 'in-use') {
      await client.send(new DetachVolumeCommand({VolumeId: volume.volumeID, InstanceId: currentAttachment}))
    } else {
      await client.send(
        new AttachVolumeCommand({Device: volume.device, InstanceId: volume.attachedTo, VolumeId: volume.volumeID}),
      )
    }
  }

  if (volume.desiredState === 'available') {
    if (currentState === 'creating') return
    if (currentState === 'deleting' || currentState === 'deleted') return
    await client.send(new DetachVolumeCommand({VolumeId: volume.volumeID}))
  }

  if (volume.desiredState === 'deleted') {
    if (currentState === 'deleting') return
    if (currentState === 'creating' || currentState === 'in-use') return
    await client.send(new DeleteVolumeCommand({VolumeId: volume.volumeID}))
  }
}

async function reconcileNewInstance(state: Instance[], instance: NewInstanceDesiredState) {
  const existing = state.find((i) => i.Tags?.some((t) => t.Key === 'depot-machine-id' && t.Value === instance.id))
  if (existing) return

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
      NetworkInterfaces: [
        {
          DeviceIndex: 0,
          AssociatePublicIpAddress: true,
          Groups: [instance.securityGroup === 'open' ? CLOUD_AGENT_SG_OPEN : CLOUD_AGENT_SG_CLOSED],
          SubnetId: CLOUD_AGENT_SUBNET_ID,
        },
      ],
      MaxCount: 1,
      MinCount: 1,
    }),
  )
}

async function reconcileInstance(state: Instance[], instance: InstanceDesiredState) {
  const current = state.find((x) => x.InstanceId === instance.instanceID)
  const currentState = current?.State?.Name ?? 'unknown'

  // Skip if already at the desired state
  if (currentState === instance.desiredState) return

  if (instance.desiredState === 'running') {
    if (currentState === 'pending') return
    if (currentState === 'shutting-down' || currentState === 'terminated' || currentState === 'stopping') return
    await client.send(new StartInstancesCommand({InstanceIds: [instance.instanceID]}))
  }

  if (instance.desiredState === 'stopped') {
    if (currentState === 'stopping') return
    if (currentState === 'shutting-down' || currentState === 'terminated') return
    await client.send(new StopInstancesCommand({InstanceIds: [instance.instanceID]}))
  }

  if (instance.desiredState === 'terminated') {
    if (currentState === 'shutting-down') return
    if (currentState === 'pending' || currentState === 'stopping') return
    await client.send(new TerminateInstancesCommand({InstanceIds: [instance.instanceID]}))
  }
}
