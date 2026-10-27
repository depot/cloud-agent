import {
  CreateVolumeCommand,
  DeleteVolumeCommand,
  DescribeInstancesCommand,
  DescribeVolumesCommand,
  EC2Client,
  RunInstancesCommand,
} from '@aws-sdk/client-ec2'
import {afterEach, beforeEach, expect, test, vi} from 'vitest'
import {
  GetDesiredStateResponse,
  GetDesiredStateResponse_Architecture,
  GetDesiredStateResponse_NewMachine,
  GetDesiredStateResponse_NewVolume,
  GetDesiredStateResponse_VolumeChange,
  GetDesiredStateResponse_VolumeState,
} from '../proto/depot/cloud/v5/cloud_pb'
import type {CurrentState} from '../types'
import {getCurrentState, reconcile} from './aws'

const tasks = vi.hoisted(() => [] as Promise<unknown>[])
vi.mock('./scheduler', () => ({
  scheduleTask: (_key: string, fn: () => Promise<unknown>) => {
    const task = fn()
    tasks.push(task)
    return task
  },
}))
vi.mock('./env', () => ({
  CLOUD_AGENT_AWS_SUBNET_ID: 'primary-subnet',
  CLOUD_AGENT_AWS_SG_BUILDKIT: 'sg-test',
  CLOUD_AGENT_CONNECTION_ID: 'test',
  additionalSubnetIDs: ['fallback-subnet'],
  configuredSubnets: [
    {id: 'primary-subnet', availability_zone: 'us-east-1a'},
    {id: 'fallback-subnet', availability_zone: 'us-east-1b'},
  ],
}))

beforeEach(() => {
  vi.restoreAllMocks()
  tasks.length = 0
  vi.stubEnv('CLOUD_AGENT_AWS_AVAILABILITY_ZONE', 'us-east-1a')
  vi.spyOn(EC2Client.prototype, 'send').mockResolvedValue({} as never)
})
afterEach(() => vi.unstubAllEnvs())
const state: CurrentState = {
  cloud: 'aws',
  availabilityZone: 'us-east-1a',
  availabilityZones: ['us-east-1a', 'us-east-1b'],
  instances: {},
  volumes: {},
}

async function apply(response: GetDesiredStateResponse, current = state) {
  await reconcile(response, current)
  await Promise.all(tasks)
}

test('reports configured AZs and includes every page of EBS inventory', async () => {
  vi.mocked(EC2Client.prototype.send).mockImplementation(async (command) => {
    if (command instanceof DescribeInstancesCommand) return {Reservations: []}
    if (command instanceof DescribeVolumesCommand)
      return command.input.NextToken
        ? {Volumes: [{VolumeId: 'vol-fallback', AvailabilityZone: 'us-east-1b'}]}
        : {Volumes: [{VolumeId: 'vol-primary', AvailabilityZone: 'us-east-1a'}], NextToken: 'next'}
    throw new Error('Unexpected AWS operation')
  })
  const result = await getCurrentState()
  expect(result.availabilityZones).toEqual(['us-east-1a', 'us-east-1b'])
  expect(Object.keys(result.volumes).sort()).toEqual(['vol-fallback', 'vol-primary'])
})

test('creates a cache in its requested AZ and defaults old requests to the primary AZ', async () => {
  await apply(
    new GetDesiredStateResponse({
      newVolumes: [
        new GetDesiredStateResponse_NewVolume({id: 'fallback', size: 100, zone: 'us-east-1b'}),
        new GetDesiredStateResponse_NewVolume({id: 'primary', size: 100}),
      ],
    }),
  )
  const commands = vi.mocked(EC2Client.prototype.send).mock.calls.map(([command]) => command)
  expect(commands.flatMap((c) => (c instanceof CreateVolumeCommand ? [c.input.AvailabilityZone] : []))).toEqual([
    'us-east-1b',
    'us-east-1a',
  ])
})

test('rejects cache placement outside the configured subnets', async () => {
  await expect(
    apply(
      new GetDesiredStateResponse({
        newVolumes: [new GetDesiredStateResponse_NewVolume({id: 'bad', zone: 'us-west-2a'})],
      }),
    ),
  ).rejects.toThrow('unconfigured availability zone')
  expect(EC2Client.prototype.send).not.toHaveBeenCalled()
})

test('tries primary first, then another configured subnet only on a capacity failure', async () => {
  const attempts: string[] = []
  vi.mocked(EC2Client.prototype.send).mockImplementation(async (command) => {
    if (command instanceof DescribeInstancesCommand) return {Reservations: []}
    if (command instanceof RunInstancesCommand) {
      attempts.push(command.input.NetworkInterfaces![0].SubnetId!)
      if (attempts.length === 1) throw new Error('InsufficientInstanceCapacity')
      return {Instances: []}
    }
    throw new Error('Unexpected AWS operation')
  })
  await apply(
    new GetDesiredStateResponse({
      newMachines: [
        new GetDesiredStateResponse_NewMachine({id: 'machine', architecture: GetDesiredStateResponse_Architecture.X86}),
      ],
    }),
  )
  expect(attempts).toEqual(['primary-subnet', 'fallback-subnet'])
})

test('does not issue an impossible cross-AZ attachment', async () => {
  await apply(
    new GetDesiredStateResponse({
      volumeChanges: [
        new GetDesiredStateResponse_VolumeChange({
          resourceId: 'volume',
          desiredState: GetDesiredStateResponse_VolumeState.ATTACHED,
          attachedTo: 'i-machine',
        }),
      ],
    }),
    {
      ...state,
      volumes: {
        'vol-cache': {
          VolumeId: 'vol-cache',
          State: 'available',
          AvailabilityZone: 'us-east-1a',
          Tags: [{Key: 'depot-volume-id', Value: 'volume'}],
        },
      },
      instances: {
        'i-machine': {InstanceId: 'i-machine', State: {Name: 'running'}, Placement: {AvailabilityZone: 'us-east-1b'}},
      },
    },
  )
  expect(EC2Client.prototype.send).not.toHaveBeenCalled()
})

test('does not try fallback subnets for other launch errors', async () => {
  const attempts: string[] = []
  vi.mocked(EC2Client.prototype.send).mockImplementation(async (command) => {
    if (command instanceof DescribeInstancesCommand) return {Reservations: []}
    if (command instanceof RunInstancesCommand) {
      attempts.push(command.input.NetworkInterfaces![0].SubnetId!)
      throw new Error('UnauthorizedOperation')
    }
    throw new Error('Unexpected AWS operation')
  })
  await expect(
    apply(new GetDesiredStateResponse({newMachines: [new GetDesiredStateResponse_NewMachine({id: 'machine'})]})),
  ).rejects.toThrow('UnauthorizedOperation')
  expect(attempts).toEqual(['primary-subnet'])
})

test('deletes volumes in every AZ by provider volume ID', async () => {
  await apply(
    new GetDesiredStateResponse({
      volumeChanges: ['primary', 'fallback'].map(
        (id) =>
          new GetDesiredStateResponse_VolumeChange({
            resourceId: id,
            desiredState: GetDesiredStateResponse_VolumeState.DELETED,
          }),
      ),
    }),
    {
      ...state,
      volumes: {
        'vol-primary': {
          VolumeId: 'vol-primary',
          State: 'available',
          AvailabilityZone: 'us-east-1a',
          Tags: [{Key: 'depot-volume-id', Value: 'primary'}],
        },
        'vol-fallback': {
          VolumeId: 'vol-fallback',
          State: 'available',
          AvailabilityZone: 'us-east-1b',
          Tags: [{Key: 'depot-volume-id', Value: 'fallback'}],
        },
      },
    },
  )
  const ids = vi
    .mocked(EC2Client.prototype.send)
    .mock.calls.flatMap(([command]) => (command instanceof DeleteVolumeCommand ? [command.input.VolumeId] : []))
  expect(ids).toEqual(['vol-primary', 'vol-fallback'])
})
