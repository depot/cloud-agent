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
import {
  MachineDesiredState,
  MachineState,
  NewMachineDesiredState,
  NewVolumeDesiredState,
  StateRequest,
  VolumeDesiredState,
  VolumeState,
} from '../types'
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

async function reconcileNewVolume(state: Volume[], volume: NewVolumeDesiredState) {
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

function currentVolumeState(volume: Volume): VolumeState {
  const state = volume.State as AwsVolumeState
  if (!state) return 'pending'
  if (state === 'available') return 'available'
  if (state === 'in-use') return 'attached'
  if (state === 'deleting' || state === 'deleted') return 'deleted'
  return 'pending'
}

async function reconcileVolume(state: Volume[], volume: VolumeDesiredState) {
  const current = state.find((i) => i.Tags?.some((t) => t.Key === 'depot-volume-id' && t.Value === volume.volumeID))
  const currentState = current ? currentVolumeState(current) : 'unknown'
  const currentAttachment = current?.Attachments?.[0]?.InstanceId

  // Skip if already at the desired state and attached to the correct machine
  if (currentState === volume.desiredState && volume.desiredState !== 'attached') return
  if (currentState === volume.desiredState && currentAttachment === volume.attachedTo) return

  if (!current || !current.VolumeId) return

  if (volume.desiredState === 'attached') {
    if (currentState === 'pending') return
    if (currentState === 'deleted') return

    if (currentState === 'attached') {
      await client.send(new DetachVolumeCommand({VolumeId: current.VolumeId, InstanceId: currentAttachment}))
    } else {
      await client.send(
        new AttachVolumeCommand({Device: volume.device, InstanceId: volume.attachedTo, VolumeId: current.VolumeId}),
      )
    }
  }

  if (volume.desiredState === 'available') {
    if (currentState === 'pending') return
    if (currentState === 'deleted') return
    await client.send(new DetachVolumeCommand({VolumeId: current.VolumeId}))
  }

  if (volume.desiredState === 'deleted') {
    if (currentState === 'pending') return
    await client.send(new DeleteVolumeCommand({VolumeId: current.VolumeId}))
  }
}

async function reconcileNewMachine(state: Instance[], machine: NewMachineDesiredState) {
  const existing = state.find((i) => i.Tags?.some((t) => t.Key === 'depot-machine-id' && t.Value === machine.id))
  if (existing) return

  await client.send(
    new RunInstancesCommand({
      LaunchTemplate: {
        LaunchTemplateId:
          machine.architecture === 'x86'
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
          Groups: [machine.securityGroup === 'buildkit' ? CLOUD_AGENT_AWS_SG_BUILDKIT : CLOUD_AGENT_AWS_SG_DEFAULT],
          SubnetId: CLOUD_AGENT_AWS_SUBNET_ID,
        },
      ],
      MaxCount: 1,
      MinCount: 1,
    }),
  )
}

function currentMachineState(instance: Instance): MachineState {
  const instanceState = (instance.State?.Name ?? 'unknown') as InstanceStateName | 'unknown'
  if (instanceState === 'running' || instanceState === 'shutting-down' || instanceState === 'stopping') return 'running'
  if (instanceState === 'stopped') return 'stopped'
  if (instanceState === 'terminated') return 'deleted'
  return 'pending'
}

async function reconcileMachine(state: Instance[], machine: MachineDesiredState) {
  const current = state.find((i) => i.Tags?.some((t) => t.Key === 'depot-machine-id' && t.Value === machine.machineID))
  const currentState = current ? currentMachineState(current) : 'unknown'

  // Skip if already at the desired state
  if (currentState === machine.desiredState) return

  if (!current || !current.InstanceId) return

  if (machine.desiredState === 'running') {
    if (currentState === 'pending') return
    if (currentState === 'deleted') return
    await client.send(new StartInstancesCommand({InstanceIds: [current.InstanceId]}))
  }

  if (machine.desiredState === 'stopped') {
    if (currentState === 'pending') return
    if (currentState === 'deleted') return
    await client.send(new StopInstancesCommand({InstanceIds: [current.InstanceId]}))
  }

  if (machine.desiredState === 'deleted') {
    if (currentState === 'pending') return
    await client.send(new TerminateInstancesCommand({InstanceIds: [current.InstanceId]}))
  }
}
