import {
  AttachVolumeCommand,
  CreateVolumeCommand,
  DeleteVolumeCommand,
  DescribeInstancesCommand,
  DescribeVolumesCommand,
  DetachVolumeCommand,
  EC2Client,
  Instance,
  InstanceStateName,
  RunInstancesCommand,
  StartInstancesCommand,
  StopInstancesCommand,
  TerminateInstancesCommand,
  Volume,
  VolumeState as AwsVolumeState,
} from '@aws-sdk/client-ec2'
import * as cloud from '../proto/depot/cloud/v1/cloud.pb'
import {StateRequest} from '../types'
import {promises} from '../utils'
import {
  CLOUD_AGENT_AWS_SG_BUILDKIT,
  CLOUD_AGENT_AWS_SG_DEFAULT,
  CLOUD_AGENT_AWS_SUBNET_ID,
  CLOUD_AGENT_CONNECTION_ID,
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
  const state: StateRequest = await promises({
    cloud: 'aws',
    availabilityZone: process.env.CLOUD_AGENT_AWS_AVAILABILITY_ZONE ?? 'unknown',
    instances: getInstancesState(),
    volumes: getVolumesState(),
    errors: [],
  })

  await reportState(state)
  const nextState = await getDesiredState()

  const results = await Promise.allSettled([
    ...nextState.newVolumes.map((volume) => reconcileNewVolume(state.volumes, volume)),
    ...nextState.volumeChanges.map((volume) => reconcileVolume(state.volumes, volume)),
    ...nextState.newMachines.map((instance) => reconcileNewMachine(state.instances, instance)),
    ...nextState.machineChanges.map((instance) => reconcileMachine(state.instances, instance)),
  ])

  return results
    .map((r) => (r.status === 'rejected' ? `${r.reason}` : undefined))
    .filter((r): r is string => r !== undefined)
}

async function reconcileNewVolume(state: Volume[], volume: cloud.GetDesiredStateResponse.NewVolume) {
  const existing = state.find((v) => v.Tags?.some((t) => t.Key === 'depot-volume-id' && t.Value === volume.id))
  if (existing) return

  await client.send(
    new CreateVolumeCommand({
      AvailabilityZone: process.env.CLOUD_AGENT_AWS_AVAILABILITY_ZONE,
      Encrypted: true,
      Size: volume.size,
      TagSpecifications: [
        {
          ResourceType: 'volume',
          Tags: [
            {Key: 'Name', Value: `depot-connection-${CLOUD_AGENT_CONNECTION_ID}-${volume.id}`},
            {Key: 'depot-connection', Value: CLOUD_AGENT_CONNECTION_ID},
            {Key: 'depot-volume-id', Value: volume.id},
            {Key: 'depot-volume-realm', Value: volume.realm},
            {Key: 'depot-volume-kind', Value: volume.kind},
            {Key: 'depot-volume-architecture', Value: volume.architecture},
          ],
        },
      ],
      VolumeType: 'gp3',
    }),
  )
}

function currentVolumeState(volume: Volume): cloud.GetDesiredStateResponse.VolumeState {
  const state = volume.State as AwsVolumeState
  if (!state) return 'VOLUME_STATE_PENDING'
  if (state === 'available') return 'VOLUME_STATE_AVAILABLE'
  if (state === 'in-use') return 'VOLUME_STATE_ATTACHED'
  if (state === 'deleting' || state === 'deleted') return 'VOLUME_STATE_DELETED'
  return 'VOLUME_STATE_PENDING'
}

async function reconcileVolume(state: Volume[], volume: cloud.GetDesiredStateResponse.VolumeChange) {
  const current = state.find((i) => i.Tags?.some((t) => t.Key === 'depot-volume-id' && t.Value === volume.id))
  const currentState = current ? currentVolumeState(current) : 'unknown'
  const currentAttachment = current?.Attachments?.[0]?.InstanceId

  // Skip if already at the desired state and attached to the correct machine
  if (currentState === volume.desiredState && volume.desiredState !== 'VOLUME_STATE_ATTACHED') return
  if (currentState === volume.desiredState && currentAttachment === volume.attachedTo) return

  if (!current || !current.VolumeId) return

  if (volume.desiredState === 'VOLUME_STATE_ATTACHED') {
    if (currentState === 'VOLUME_STATE_PENDING') return
    if (currentState === 'VOLUME_STATE_DELETED') return

    if (currentState === 'VOLUME_STATE_ATTACHED') {
      await client.send(new DetachVolumeCommand({VolumeId: current.VolumeId, InstanceId: currentAttachment}))
    } else {
      await client.send(
        new AttachVolumeCommand({Device: volume.device!, InstanceId: volume.attachedTo!, VolumeId: current.VolumeId}),
      )
    }
  }

  if (volume.desiredState === 'VOLUME_STATE_AVAILABLE') {
    if (currentState === 'VOLUME_STATE_PENDING') return
    if (currentState === 'VOLUME_STATE_DELETED') return
    await client.send(new DetachVolumeCommand({VolumeId: current.VolumeId}))
  }

  if (volume.desiredState === 'VOLUME_STATE_DELETED') {
    if (currentState === 'VOLUME_STATE_PENDING') return
    await client.send(new DeleteVolumeCommand({VolumeId: current.VolumeId}))
  }
}

async function reconcileNewMachine(state: Instance[], machine: cloud.GetDesiredStateResponse.NewMachine) {
  const existing = state.find((i) => i.Tags?.some((t) => t.Key === 'depot-machine-id' && t.Value === machine.id))
  if (existing) return

  await client.send(
    new RunInstancesCommand({
      LaunchTemplate: {
        LaunchTemplateId:
          machine.architecture === 'ARCHITECTURE_X86'
            ? process.env.CLOUD_AGENT_AWS_LAUNCH_TEMPLATE_X86
            : process.env.CLOUD_AGENT_AWS_LAUNCH_TEMPLATE_ARM,
      },
      ImageId: machine.image,
      TagSpecifications: [
        {
          ResourceType: 'instance',
          Tags: [
            {Key: 'Name', Value: `depot-connection-${CLOUD_AGENT_CONNECTION_ID}-${machine.id}`},
            {Key: 'depot-connection', Value: CLOUD_AGENT_CONNECTION_ID},
            {Key: 'depot-machine-id', Value: machine.id},
            {Key: 'depot-machine-realm', Value: machine.realm},
            {Key: 'depot-machine-kind', Value: machine.kind},
            {Key: 'depot-machine-architecture', Value: machine.architecture},
          ],
        },
      ],
      NetworkInterfaces: [
        {
          DeviceIndex: 0,
          AssociatePublicIpAddress: true,
          Groups: [
            machine.securityGroup === 'SECURITY_GROUP_BUILDKIT'
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
}

function currentMachineState(instance: Instance): cloud.GetDesiredStateResponse.MachineState {
  const instanceState = (instance.State?.Name ?? 'unknown') as InstanceStateName | 'unknown'
  if (instanceState === 'running') return 'MACHINE_STATE_RUNNING'
  if (instanceState === 'stopping') return 'MACHINE_STATE_STOPPING'
  if (instanceState === 'stopped') return 'MACHINE_STATE_STOPPED'
  if (instanceState === 'shutting-down') return 'MACHINE_STATE_DELETING'
  if (instanceState === 'terminated') return 'MACHINE_STATE_DELETED'
  return 'MACHINE_STATE_PENDING'
}

async function reconcileMachine(state: Instance[], machine: cloud.GetDesiredStateResponse.MachineChange) {
  const current = state.find((i) => i.Tags?.some((t) => t.Key === 'depot-machine-id' && t.Value === machine.id))
  const currentState = current ? currentMachineState(current) : 'unknown'

  // Skip if already at the desired state
  if (currentState === machine.desiredState) return

  if (!current || !current.InstanceId) return

  if (machine.desiredState === 'MACHINE_STATE_RUNNING') {
    if (currentState === 'MACHINE_STATE_PENDING') return
    if (currentState === 'MACHINE_STATE_DELETED') return
    await client.send(new StartInstancesCommand({InstanceIds: [current.InstanceId]}))
  }

  if (machine.desiredState === 'MACHINE_STATE_STOPPED') {
    if (currentState === 'MACHINE_STATE_PENDING') return
    if (currentState === 'MACHINE_STATE_DELETED') return
    await client.send(new StopInstancesCommand({InstanceIds: [current.InstanceId]}))
  }

  if (machine.desiredState === 'MACHINE_STATE_DELETED') {
    if (currentState === 'MACHINE_STATE_PENDING') return
    await client.send(new TerminateInstancesCommand({InstanceIds: [current.InstanceId]}))
  }
}
