import {
  AttachVolumeCommand,
  VolumeState as AwsVolumeState,
  BlockDeviceMapping,
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
} from '@aws-sdk/client-ec2'
import {
  GetDesiredStateResponse,
  GetDesiredStateResponse_Architecture,
  GetDesiredStateResponse_MachineChange,
  GetDesiredStateResponse_MachineState,
  GetDesiredStateResponse_NewMachine,
  GetDesiredStateResponse_NewVolume,
  GetDesiredStateResponse_VolumeChange,
  GetDesiredStateResponse_VolumeState,
} from '../proto/depot/cloud/v2/cloud_pb'
import {CurrentState} from '../types'
import {promises} from './common'
import {
  CLOUD_AGENT_AWS_SG_BUILDKIT,
  CLOUD_AGENT_AWS_SUBNET_ID,
  CLOUD_AGENT_CONNECTION_ID,
  additionalSubnetIDs,
} from './env'

const client = new EC2Client({})

export async function getCurrentState() {
  const state: CurrentState = await promises({
    cloud: 'aws',
    availabilityZone: process.env.CLOUD_AGENT_AWS_AVAILABILITY_ZONE ?? 'unknown',
    instances: getInstancesState(),
    volumes: getVolumesState(),
    errors: [],
  })
  return toPlainObject(state)
}

export async function reconcile(response: GetDesiredStateResponse, state: CurrentState): Promise<string[]> {
  const results = await Promise.allSettled([
    ...response.newVolumes.map((volume) => reconcileNewVolume(state.volumes, volume)),
    ...response.volumeChanges.map((volume) => reconcileVolume(state.volumes, volume, state.instances)),
    ...response.newMachines.map((instance) => reconcileNewMachine(state.instances, instance)),
    ...response.machineChanges.map((instance) => reconcileMachine(state.instances, instance)),
  ])

  return results
    .map((r) => (r.status === 'rejected' ? `${r.reason}` : undefined))
    .filter((r): r is string => r !== undefined)
}

/** Filter to select only Depot-managed resources */
const tagFilter = {Name: 'tag:depot-connection', Values: [CLOUD_AGENT_CONNECTION_ID]}

/** Queries for all managed instances */
async function getInstancesState() {
  const res = await client.send(new DescribeInstancesCommand({Filters: [tagFilter]}))
  const instances = res.Reservations?.flatMap((r) => r.Instances || []) || []
  return instances.reduce(
    (acc, instance) => {
      if (!instance.InstanceId) return acc
      acc[instance.InstanceId] = instance
      return acc
    },
    {} as Record<string, Instance>,
  )
}

/** Queries for all managed volumes */
async function getVolumesState() {
  const res = await client.send(new DescribeVolumesCommand({Filters: [tagFilter]}))
  const volumes = res.Volumes || []
  return volumes.reduce(
    (acc, volume) => {
      if (!volume.VolumeId) return acc
      acc[volume.VolumeId] = volume
      return acc
    },
    {} as Record<string, Volume>,
  )
}

async function reconcileNewVolume(state: Record<string, Volume>, volume: GetDesiredStateResponse_NewVolume) {
  const existing = Object.values(state).find(
    (v) => v.Tags?.some((t) => t.Key === 'depot-volume-id' && t.Value === volume.id),
  )
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
          ],
        },
      ],
      VolumeType: 'gp3',
    }),
  )
}

function currentVolumeState(volume: Volume): GetDesiredStateResponse_VolumeState {
  const state = volume.State as AwsVolumeState
  if (!state) return GetDesiredStateResponse_VolumeState.PENDING
  if (state === 'available') return GetDesiredStateResponse_VolumeState.AVAILABLE
  if (state === 'in-use') return GetDesiredStateResponse_VolumeState.ATTACHED
  if (state === 'deleting' || state === 'deleted') return GetDesiredStateResponse_VolumeState.DELETED
  return GetDesiredStateResponse_VolumeState.PENDING
}

async function reconcileVolume(
  state: Record<string, Volume>,
  volume: GetDesiredStateResponse_VolumeChange,
  machineState: Record<string, Instance>,
) {
  const current = Object.values(state).find(
    (i) => i.Tags?.some((t) => t.Key === 'depot-volume-id' && t.Value === volume.id),
  )
  const currentState = current ? currentVolumeState(current) : 'unknown'
  const currentAttachment = current?.Attachments?.[0]?.InstanceId

  // Skip if already at the desired state and attached to the correct machine
  if (currentState === volume.desiredState && volume.desiredState !== GetDesiredStateResponse_VolumeState.ATTACHED)
    return
  if (currentState === volume.desiredState && currentAttachment === volume.attachedTo) return

  if (!current || !current.VolumeId) return

  if (volume.desiredState === GetDesiredStateResponse_VolumeState.ATTACHED) {
    if (currentState === GetDesiredStateResponse_VolumeState.PENDING) return
    if (currentState === GetDesiredStateResponse_VolumeState.DELETED) return

    if (currentState === GetDesiredStateResponse_VolumeState.ATTACHED) {
      await client.send(new DetachVolumeCommand({VolumeId: current.VolumeId, InstanceId: currentAttachment}))
    } else {
      const machine = machineState[volume.attachedTo!]
      const currentState = machine ? currentMachineState(machine) : 'unknown'
      if (currentState !== GetDesiredStateResponse_MachineState.RUNNING) return
      await client.send(
        new AttachVolumeCommand({Device: volume.device!, InstanceId: volume.attachedTo!, VolumeId: current.VolumeId}),
      )
    }
  }

  if (volume.desiredState === GetDesiredStateResponse_VolumeState.AVAILABLE) {
    if (currentState === GetDesiredStateResponse_VolumeState.PENDING) return
    if (currentState === GetDesiredStateResponse_VolumeState.DELETED) return
    await client.send(new DetachVolumeCommand({VolumeId: current.VolumeId}))
  }

  if (volume.desiredState === GetDesiredStateResponse_VolumeState.DELETED) {
    if (currentState === GetDesiredStateResponse_VolumeState.PENDING) return
    await client.send(new DeleteVolumeCommand({VolumeId: current.VolumeId}))
  }
}

async function reconcileNewMachine(state: Record<string, Instance>, machine: GetDesiredStateResponse_NewMachine) {
  const existing = Object.values(state).find(
    (i) => i.Tags?.some((t) => t.Key === 'depot-machine-id' && t.Value === machine.id),
  )
  if (existing) return

  try {
    return await runInstance(machine)
  } catch (err: any) {
    if (isCapacityError(err)) {
      console.log(`[${machine.id}] No capacity in subnet ${CLOUD_AGENT_AWS_SUBNET_ID}, trying additional subnets`)
      for (const subnetID of additionalSubnetIDs) {
        try {
          return await runInstance(machine, subnetID)
        } catch (err: any) {
          if (isCapacityError(err)) {
            console.log(`[${machine.id}] No capacity in subnet ${subnetID}, skipping`)
          } else {
            throw err
          }
        }
      }
    }
    throw err
  }
}

function isCapacityError(err: Error) {
  return err.toString().includes('InsufficientInstanceCapacity')
}

async function runInstance(machine: GetDesiredStateResponse_NewMachine, subnetID = CLOUD_AGENT_AWS_SUBNET_ID) {
  const res = await client.send(
    new DescribeInstancesCommand({
      Filters: [
        {Name: 'tag:depot-connection', Values: [CLOUD_AGENT_CONNECTION_ID]},
        {Name: 'tag:depot-machine-id', Values: [machine.id]},
      ],
    }),
  )
  const instances = res.Reservations?.flatMap((r) => r.Instances || []) || []
  if (instances.length > 0) {
    console.log(`Found existing ${instances.length} instances for machine ID ${machine.id}, skipping`)
    return
  }

  // if (subnetID === 'subnet-0401dcbe48439ad9b') {
  //   throw new Error('InsufficientInstanceCapacity: simulating capacity error')
  // }

  // Construct user data with cloud connection ID
  const userData = `
#!/bin/bash
set -e
exec > >(tee /var/log/user-data.log | logger -t user-data -s 2>/dev/console) 2>&1

cat << EOF > /usr/lib/systemd/system/machine-agent.service
[Unit]
Description=machine-agent
After=network-online.target vector.service
Requires=network-online.target
[Service]
Type=simple
ExecStart=/usr/bin/machine-agent
Restart=always
RestartSec=5
Environment="DEPOT_CLOUD_CONNECTION_ID=${CLOUD_AGENT_CONNECTION_ID}"
[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable machine-agent.service
systemctl start machine-agent.service
`.trim()

  const blockDeviceMappings: BlockDeviceMapping[] = []

  if (machine.rootVolume) {
    blockDeviceMappings.push({
      DeviceName: machine.rootVolume.deviceName ?? '/dev/xvda',
      Ebs: {
        VolumeSize: machine.rootVolume.size ?? 40,
        VolumeType: 'gp3',
        DeleteOnTermination: true,
        Encrypted: true,
      },
    })
  } else {
    blockDeviceMappings.push({
      DeviceName: '/dev/xvda',
      Ebs: {
        VolumeSize: 40,
        VolumeType: 'gp3',
        DeleteOnTermination: true,
        Encrypted: true,
      },
    })
  }

  // If not using /dev/xvda, remove it from the launch template
  if (machine.rootVolume?.deviceName !== '/dev/xvda') {
    blockDeviceMappings.push({
      DeviceName: '/dev/xvda',
      NoDevice: '',
    })
  }

  await client.send(
    new RunInstancesCommand({
      LaunchTemplate: {
        LaunchTemplateId:
          machine.architecture === GetDesiredStateResponse_Architecture.X86
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
          ],
        },
      ],
      NetworkInterfaces: [
        {
          DeviceIndex: 0,
          AssociatePublicIpAddress: true,
          Groups: [CLOUD_AGENT_AWS_SG_BUILDKIT],
          SubnetId: subnetID,
        },
      ],
      BlockDeviceMappings: blockDeviceMappings,
      MaxCount: 1,
      MinCount: 1,
      UserData: Buffer.from(userData).toString('base64'),
    }),
  )
}

function currentMachineState(instance: Instance): GetDesiredStateResponse_MachineState {
  const instanceState = (instance.State?.Name ?? 'unknown') as InstanceStateName | 'unknown'
  if (instanceState === 'running') return GetDesiredStateResponse_MachineState.RUNNING
  if (instanceState === 'stopping') return GetDesiredStateResponse_MachineState.STOPPING
  if (instanceState === 'stopped') return GetDesiredStateResponse_MachineState.STOPPED
  if (instanceState === 'shutting-down') return GetDesiredStateResponse_MachineState.DELETING
  if (instanceState === 'terminated') return GetDesiredStateResponse_MachineState.DELETED
  return GetDesiredStateResponse_MachineState.PENDING
}

async function reconcileMachine(state: Record<string, Instance>, machine: GetDesiredStateResponse_MachineChange) {
  const matches = Object.values(state).filter(
    (i) => i.Tags?.some((t) => t.Key === 'depot-machine-id' && t.Value === machine.id),
  )

  for (const current of matches) {
    const currentState = current ? currentMachineState(current) : 'unknown'

    // Skip if already at the desired state
    if (currentState === machine.desiredState) return

    if (!current || !current.InstanceId) return

    if (machine.desiredState === GetDesiredStateResponse_MachineState.RUNNING) {
      if (currentState === GetDesiredStateResponse_MachineState.PENDING) return
      if (currentState === GetDesiredStateResponse_MachineState.DELETED) return
      await client.send(new StartInstancesCommand({InstanceIds: [current.InstanceId]}))
    }

    if (machine.desiredState === GetDesiredStateResponse_MachineState.STOPPED) {
      if (currentState === GetDesiredStateResponse_MachineState.PENDING) return
      if (currentState === GetDesiredStateResponse_MachineState.DELETED) return
      await client.send(new StopInstancesCommand({InstanceIds: [current.InstanceId]}))
    }

    if (machine.desiredState === GetDesiredStateResponse_MachineState.DELETED) {
      if (currentState === GetDesiredStateResponse_MachineState.PENDING) return
      await client.send(new TerminateInstancesCommand({InstanceIds: [current.InstanceId]}))
    }
  }
}

function toPlainObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}
