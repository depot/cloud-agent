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
  paginateDescribeInstances,
  paginateDescribeVolumes,
  RunInstancesCommand,
  StartInstancesCommand,
  StopInstancesCommand,
  TerminateInstancesCommand,
  Volume,
  VolumeState as AwsVolumeState,
} from '@aws-sdk/client-ec2'
import {
  Action_CreateMachine,
  Action_CreateVolume,
  Action_UpdateMachine,
  Action_UpdateVolume,
  Architecture,
  MachineState,
  SecurityGroup,
  VolumeState,
} from '../proto/depot/cloud/v3/cloud'
import {
  CLOUD_AGENT_AWS_SG_BUILDKIT,
  CLOUD_AGENT_AWS_SG_DEFAULT,
  CLOUD_AGENT_AWS_SUBNET_ID,
  CLOUD_AGENT_CONNECTION_ID,
} from './env'

const client = new EC2Client({})

/** Filter to select only Depot-managed resources */
const tagFilter = {Name: 'tag:depot-connection', Values: [CLOUD_AGENT_CONNECTION_ID]}

/** Queries for all managed instances */
export async function getAllInstances(): Promise<Instance[]> {
  const stream = paginateDescribeInstances({client, pageSize: 100}, {Filters: [tagFilter]})
  const instances: Instance[] = []
  for await (const res of stream) {
    instances.push(...(res.Reservations?.flatMap((r) => r.Instances || []) || []))
  }
  return instances
}

/** Queries for all managed volumes */
export async function getAllVolumes(): Promise<Volume[]> {
  const stream = paginateDescribeVolumes({client, pageSize: 100}, {Filters: [tagFilter]})
  const volumes: Volume[] = []
  for await (const res of stream) {
    volumes.push(...(res.Volumes ?? []))
  }
  return volumes
}

async function getVolumeState(volumeID: string) {
  const res = await client.send(
    new DescribeVolumesCommand({
      Filters: [
        {Name: 'tag:depot-connection', Values: [CLOUD_AGENT_CONNECTION_ID]},
        {Name: 'tag:depot-volume-id', Values: [volumeID]},
      ],
    }),
  )
  const volumes = res.Volumes ?? []
  if (volumes.length === 0) return undefined
  return volumes[0]
}

export async function createVolume(volume: Action_CreateVolume) {
  const existing = await getVolumeState(volume.volumeId)
  if (existing) {
    console.log(`Found existing volume for volume ID ${volume.volumeId}, skipping`)
    return
  }

  await client.send(
    new CreateVolumeCommand({
      AvailabilityZone: process.env.CLOUD_AGENT_AWS_AVAILABILITY_ZONE,
      Encrypted: true,
      Size: volume.size,
      TagSpecifications: [
        {
          ResourceType: 'volume',
          Tags: [
            {Key: 'Name', Value: `depot-connection-${CLOUD_AGENT_CONNECTION_ID}-${volume.volumeId}`},
            {Key: 'depot-connection', Value: CLOUD_AGENT_CONNECTION_ID},
            {Key: 'depot-volume-id', Value: volume.volumeId},
            {Key: 'depot-volume-realm', Value: volume.projectId},
          ],
        },
      ],
      VolumeType: 'gp3',
    }),
  )
}

function currentVolumeState(volume: Volume): VolumeState {
  const state = volume.State as AwsVolumeState
  if (!state) return VolumeState.VOLUME_STATE_PENDING
  if (state === 'available') return VolumeState.VOLUME_STATE_AVAILABLE
  if (state === 'in-use') return VolumeState.VOLUME_STATE_ATTACHED
  if (state === 'deleting' || state === 'deleted') return VolumeState.VOLUME_STATE_DELETED
  return VolumeState.VOLUME_STATE_PENDING
}

export async function updateVolume(volume: Action_UpdateVolume) {
  const current = await getVolumeState(volume.volumeId)
  if (!current) {
    console.log(`No volume found for volume ID ${volume.volumeId}, skipping`)
    return
  }

  const currentState = currentVolumeState(current)
  const currentAttachment = current.Attachments?.[0]?.InstanceId

  // Skip if already at the desired state and attached to the correct machine
  if (currentState === volume.desiredState && volume.desiredState !== VolumeState.VOLUME_STATE_ATTACHED) return
  if (currentState === volume.desiredState && currentAttachment === volume.attachment?.machineResourceId) return

  if (!current || !current.VolumeId) return

  if (volume.desiredState === VolumeState.VOLUME_STATE_ATTACHED) {
    if (currentState === VolumeState.VOLUME_STATE_PENDING) return
    if (currentState === VolumeState.VOLUME_STATE_DELETED) return

    if (currentState === VolumeState.VOLUME_STATE_ATTACHED) {
      await client.send(new DetachVolumeCommand({VolumeId: current.VolumeId, InstanceId: currentAttachment}))
    } else {
      await client.send(
        new AttachVolumeCommand({
          Device: volume.attachment?.device!,
          InstanceId: volume.attachment?.machineResourceId!,
          VolumeId: current.VolumeId,
        }),
      )
    }
  }

  if (volume.desiredState === VolumeState.VOLUME_STATE_AVAILABLE) {
    if (currentState === VolumeState.VOLUME_STATE_PENDING) return
    if (currentState === VolumeState.VOLUME_STATE_DELETED) return
    await client.send(new DetachVolumeCommand({VolumeId: current.VolumeId}))
  }

  if (volume.desiredState === VolumeState.VOLUME_STATE_DELETED) {
    if (currentState === VolumeState.VOLUME_STATE_PENDING) return
    await client.send(new DeleteVolumeCommand({VolumeId: current.VolumeId}))
  }
}

export async function createMachine(machine: Action_CreateMachine) {
  const res = await client.send(
    new DescribeInstancesCommand({
      Filters: [
        {Name: 'tag:depot-connection', Values: [CLOUD_AGENT_CONNECTION_ID]},
        {Name: 'tag:depot-machine-id', Values: [machine.machineId]},
      ],
    }),
  )
  const instances = res.Reservations?.flatMap((r) => r.Instances || []) || []
  if (instances.length > 0) {
    console.log(`Found existing ${instances.length} instances for machine ID ${machine.machineId}, skipping`)
    return
  }

  // Construct user data with cloud connection ID
  const userData = `
#!/bin/bash
set -e
exec > >(tee /var/log/user-data.log | logger -t user-data -s 2>/dev/console) 2>&1

cat << EOF > /usr/lib/systemd/system/machine-agent.service
[Unit]
Description=machine-agent
After=network-online.target
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

  await client.send(
    new RunInstancesCommand({
      LaunchTemplate: {
        LaunchTemplateId:
          machine.architecture === Architecture.ARCHITECTURE_X86
            ? process.env.CLOUD_AGENT_AWS_LAUNCH_TEMPLATE_X86
            : process.env.CLOUD_AGENT_AWS_LAUNCH_TEMPLATE_ARM,
      },
      ImageId: machine.image,
      TagSpecifications: [
        {
          ResourceType: 'instance',
          Tags: [
            {Key: 'Name', Value: `depot-connection-${CLOUD_AGENT_CONNECTION_ID}-${machine.machineId}`},
            {Key: 'depot-connection', Value: CLOUD_AGENT_CONNECTION_ID},
            {Key: 'depot-machine-id', Value: machine.machineId},
          ],
        },
      ],
      NetworkInterfaces: [
        {
          DeviceIndex: 0,
          AssociatePublicIpAddress: true,
          Groups: [
            machine.securityGroup === SecurityGroup.SECURITY_GROUP_BUILDKIT
              ? CLOUD_AGENT_AWS_SG_BUILDKIT
              : CLOUD_AGENT_AWS_SG_DEFAULT,
          ],
          SubnetId: CLOUD_AGENT_AWS_SUBNET_ID,
        },
      ],
      BlockDeviceMappings: [
        {
          DeviceName: '/dev/xvda',
          Ebs: {
            VolumeSize: 40,
            VolumeType: 'gp3',
            DeleteOnTermination: true,
            Encrypted: true,
          },
        },
      ],
      MaxCount: 1,
      MinCount: 1,
      UserData: Buffer.from(userData).toString('base64'),
    }),
  )
}

function currentMachineState(instance: Instance): MachineState {
  const instanceState = (instance.State?.Name ?? 'unknown') as InstanceStateName | 'unknown'
  if (instanceState === 'running') return MachineState.MACHINE_STATE_RUNNING
  if (instanceState === 'stopping') return MachineState.MACHINE_STATE_STOPPING
  if (instanceState === 'stopped') return MachineState.MACHINE_STATE_STOPPED
  if (instanceState === 'shutting-down') return MachineState.MACHINE_STATE_DELETING
  if (instanceState === 'terminated') return MachineState.MACHINE_STATE_DELETED
  return MachineState.MACHINE_STATE_PENDING
}

export async function updateMachine(machine: Action_UpdateMachine) {
  const res = await client.send(
    new DescribeInstancesCommand({
      Filters: [
        {Name: 'tag:depot-connection', Values: [CLOUD_AGENT_CONNECTION_ID]},
        {Name: 'tag:depot-machine-id', Values: [machine.machineId]},
      ],
    }),
  )
  const instances = res.Reservations?.flatMap((r) => r.Instances || []) || []

  for (const current of instances) {
    const currentState = current ? currentMachineState(current) : 'unknown'

    // Skip if already at the desired state
    if (currentState === machine.desiredState) return

    if (!current || !current.InstanceId) return

    if (machine.desiredState === MachineState.MACHINE_STATE_RUNNING) {
      if (currentState === MachineState.MACHINE_STATE_PENDING) return
      if (currentState === MachineState.MACHINE_STATE_DELETED) return
      await client.send(new StartInstancesCommand({InstanceIds: [current.InstanceId]}))
    }

    if (machine.desiredState === MachineState.MACHINE_STATE_STOPPED) {
      if (currentState === MachineState.MACHINE_STATE_PENDING) return
      if (currentState === MachineState.MACHINE_STATE_DELETED) return
      await client.send(new StopInstancesCommand({InstanceIds: [current.InstanceId]}))
    }

    if (machine.desiredState === MachineState.MACHINE_STATE_DELETED) {
      if (currentState === MachineState.MACHINE_STATE_PENDING) return
      await client.send(new TerminateInstancesCommand({InstanceIds: [current.InstanceId]}))
    }
  }
}

function toPlainObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}
