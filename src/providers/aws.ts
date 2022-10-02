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
  GetDesiredStateResponse_Architecture,
  GetDesiredStateResponse_MachineChange,
  GetDesiredStateResponse_MachineState,
  GetDesiredStateResponse_NewMachine,
  GetDesiredStateResponse_NewVolume,
  GetDesiredStateResponse_SecurityGroup,
  GetDesiredStateResponse_VolumeChange,
  GetDesiredStateResponse_VolumeState,
} from '../proto/depot/cloud/v1/cloud'
import {StateRequest} from '../types'
import {promises} from '../utils'
import {
  AWS_AVAILABILITY_ZONE,
  AWS_LAUNCH_TEMPLATE_ARM,
  AWS_LAUNCH_TEMPLATE_X86,
  AWS_SG_BUILDKIT,
  AWS_SG_DEFAULT,
  AWS_SUBNET_ID,
  CONNECTION_ID,
} from '../utils/env'
import {getDesiredState, reportState} from './depot'

const client = new EC2Client({})

/** Filter to select only Depot-managed resources */
const tagFilter = {Name: 'tag:depot-connection', Values: [CONNECTION_ID]}

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
    availabilityZone: AWS_AVAILABILITY_ZONE,
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

async function reconcileNewVolume(state: Volume[], volume: GetDesiredStateResponse_NewVolume) {
  const existing = state.find((v) => v.Tags?.some((t) => t.Key === 'depot-volume-id' && t.Value === volume.id))
  if (existing) return

  await client.send(
    new CreateVolumeCommand({
      AvailabilityZone: AWS_AVAILABILITY_ZONE,
      Encrypted: true,
      Size: volume.size,
      TagSpecifications: [
        {
          ResourceType: 'volume',
          Tags: [
            {Key: 'Name', Value: `depot-connection-${CONNECTION_ID}-${volume.id}`},
            {Key: 'depot-connection', Value: CONNECTION_ID},
            {Key: 'depot-volume-id', Value: volume.id},
            {Key: 'depot-volume-realm', Value: volume.realm},
          ],
        },
      ],
      VolumeType: 'gp3',
    }),
  )
}

function currentVolumeState(volume: Volume): GetDesiredStateResponse_VolumeState {
  const state = volume.State as AwsVolumeState
  if (!state) return GetDesiredStateResponse_VolumeState.VOLUME_STATE_PENDING
  if (state === 'available') return GetDesiredStateResponse_VolumeState.VOLUME_STATE_AVAILABLE
  if (state === 'in-use') return GetDesiredStateResponse_VolumeState.VOLUME_STATE_ATTACHED
  if (state === 'deleting' || state === 'deleted') return GetDesiredStateResponse_VolumeState.VOLUME_STATE_DELETED
  return GetDesiredStateResponse_VolumeState.VOLUME_STATE_PENDING
}

async function reconcileVolume(state: Volume[], volume: GetDesiredStateResponse_VolumeChange) {
  const current = state.find((i) => i.Tags?.some((t) => t.Key === 'depot-volume-id' && t.Value === volume.id))
  const currentState = current ? currentVolumeState(current) : 'unknown'
  const currentAttachment = current?.Attachments?.[0]?.InstanceId

  // Skip if already at the desired state and attached to the correct machine
  if (
    currentState === volume.desiredState &&
    volume.desiredState !== GetDesiredStateResponse_VolumeState.VOLUME_STATE_ATTACHED
  )
    return
  if (currentState === volume.desiredState && currentAttachment === volume.attachedTo) return

  if (!current || !current.VolumeId) return

  if (volume.desiredState === GetDesiredStateResponse_VolumeState.VOLUME_STATE_ATTACHED) {
    if (currentState === GetDesiredStateResponse_VolumeState.VOLUME_STATE_PENDING) return
    if (currentState === GetDesiredStateResponse_VolumeState.VOLUME_STATE_DELETED) return

    if (currentState === GetDesiredStateResponse_VolumeState.VOLUME_STATE_ATTACHED) {
      await client.send(new DetachVolumeCommand({VolumeId: current.VolumeId, InstanceId: currentAttachment}))
    } else {
      await client.send(
        new AttachVolumeCommand({Device: volume.device!, InstanceId: volume.attachedTo!, VolumeId: current.VolumeId}),
      )
    }
  }

  if (volume.desiredState === GetDesiredStateResponse_VolumeState.VOLUME_STATE_AVAILABLE) {
    if (currentState === GetDesiredStateResponse_VolumeState.VOLUME_STATE_PENDING) return
    if (currentState === GetDesiredStateResponse_VolumeState.VOLUME_STATE_DELETED) return
    await client.send(new DetachVolumeCommand({VolumeId: current.VolumeId}))
  }

  if (volume.desiredState === GetDesiredStateResponse_VolumeState.VOLUME_STATE_DELETED) {
    if (currentState === GetDesiredStateResponse_VolumeState.VOLUME_STATE_PENDING) return
    await client.send(new DeleteVolumeCommand({VolumeId: current.VolumeId}))
  }
}

async function reconcileNewMachine(state: Instance[], machine: GetDesiredStateResponse_NewMachine) {
  const existing = state.find((i) => i.Tags?.some((t) => t.Key === 'depot-machine-id' && t.Value === machine.id))
  if (existing) return

  await client.send(
    new RunInstancesCommand({
      LaunchTemplate: {
        LaunchTemplateId:
          machine.architecture === GetDesiredStateResponse_Architecture.ARCHITECTURE_X86
            ? AWS_LAUNCH_TEMPLATE_X86
            : AWS_LAUNCH_TEMPLATE_ARM,
      },
      ImageId: machine.image,
      TagSpecifications: [
        {
          ResourceType: 'instance',
          Tags: [
            {Key: 'Name', Value: `depot-connection-${CONNECTION_ID}-${machine.id}`},
            {Key: 'depot-connection', Value: CONNECTION_ID},
            {Key: 'depot-machine-id', Value: machine.id},
            {Key: 'depot-machine-realm', Value: machine.realm},
          ],
        },
      ],
      NetworkInterfaces: [
        {
          DeviceIndex: 0,
          AssociatePublicIpAddress: true,
          Groups: [
            machine.securityGroup === GetDesiredStateResponse_SecurityGroup.SECURITY_GROUP_BUILDKIT
              ? AWS_SG_BUILDKIT
              : AWS_SG_DEFAULT,
          ],
          SubnetId: AWS_SUBNET_ID,
        },
      ],
      MaxCount: 1,
      MinCount: 1,
    }),
  )
}

function currentMachineState(instance: Instance): GetDesiredStateResponse_MachineState {
  const instanceState = (instance.State?.Name ?? 'unknown') as InstanceStateName | 'unknown'
  if (instanceState === 'running') return GetDesiredStateResponse_MachineState.MACHINE_STATE_RUNNING
  if (instanceState === 'stopping') return GetDesiredStateResponse_MachineState.MACHINE_STATE_STOPPING
  if (instanceState === 'stopped') return GetDesiredStateResponse_MachineState.MACHINE_STATE_STOPPED
  if (instanceState === 'shutting-down') return GetDesiredStateResponse_MachineState.MACHINE_STATE_DELETING
  if (instanceState === 'terminated') return GetDesiredStateResponse_MachineState.MACHINE_STATE_DELETED
  return GetDesiredStateResponse_MachineState.MACHINE_STATE_PENDING
}

async function reconcileMachine(state: Instance[], machine: GetDesiredStateResponse_MachineChange) {
  const current = state.find((i) => i.Tags?.some((t) => t.Key === 'depot-machine-id' && t.Value === machine.id))
  const currentState = current ? currentMachineState(current) : 'unknown'

  // Skip if already at the desired state
  if (currentState === machine.desiredState) return

  if (!current || !current.InstanceId) return

  if (machine.desiredState === GetDesiredStateResponse_MachineState.MACHINE_STATE_RUNNING) {
    if (currentState === GetDesiredStateResponse_MachineState.MACHINE_STATE_PENDING) return
    if (currentState === GetDesiredStateResponse_MachineState.MACHINE_STATE_DELETED) return
    await client.send(new StartInstancesCommand({InstanceIds: [current.InstanceId]}))
  }

  if (machine.desiredState === GetDesiredStateResponse_MachineState.MACHINE_STATE_STOPPED) {
    if (currentState === GetDesiredStateResponse_MachineState.MACHINE_STATE_PENDING) return
    if (currentState === GetDesiredStateResponse_MachineState.MACHINE_STATE_DELETED) return
    await client.send(new StopInstancesCommand({InstanceIds: [current.InstanceId]}))
  }

  if (machine.desiredState === GetDesiredStateResponse_MachineState.MACHINE_STATE_DELETED) {
    if (currentState === GetDesiredStateResponse_MachineState.MACHINE_STATE_PENDING) return
    await client.send(new TerminateInstancesCommand({InstanceIds: [current.InstanceId]}))
  }
}
