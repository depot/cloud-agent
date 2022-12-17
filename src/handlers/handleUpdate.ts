import {
  AttachVolumeCommand,
  DeleteVolumeCommand,
  DetachVolumeCommand,
  Instance,
  InstanceStateName,
  StartInstancesCommand,
  StopInstancesCommand,
  TerminateInstancesCommand,
  Volume,
  VolumeState as AwsVolumeState,
} from '@aws-sdk/client-ec2'
import {
  GetUpdateStreamResponse,
  GetUpdateStreamResponse_MachineState,
  GetUpdateStreamResponse_UpdateMachine,
  GetUpdateStreamResponse_UpdateVolume,
  GetUpdateStreamResponse_VolumeState,
} from '../proto/depot/cloud/v3/cloud'
import {CurrentState} from '../types'
import {ec2} from '../utils/aws'
import {reportError} from '../utils/errors'
import {client} from '../utils/grpc'
import {getCurrentState, reportCurrentState} from '../utils/state'

export async function startHandleUpdateStream(signal: AbortSignal) {
  while (!signal.aborted) {
    try {
      let currentState = await getCurrentState()
      await reportCurrentState(currentState)

      const stream = client.getUpdateStream({}, {signal})

      for await (const response of stream) {
        currentState = await getCurrentState()
        await reconcile(response, currentState)
        currentState = await getCurrentState()
        await reportCurrentState(currentState)
      }
    } catch (err: any) {
      await reportError(err)
    }
  }
}

export async function reconcile(response: GetUpdateStreamResponse, state: CurrentState) {
  const results = await Promise.allSettled([
    ...response.machines.map((instance) => reconcileMachine(state.instances, instance)),
    ...response.volumes.map((volume) => reconcileVolume(state.volumes, volume)),
  ])

  const group = results
    .map((r) => (r.status === 'rejected' ? `${r.reason}` : undefined))
    .filter((r): r is string => r !== undefined)
  if (group.length > 0) throw new Error(group.join(', '))
}

async function reconcileMachine(state: Record<string, Instance>, machine: GetUpdateStreamResponse_UpdateMachine) {
  const current = state[machine.instanceId]
  if (!current || !current.InstanceId) return
  const currentState = current.State?.Name as InstanceStateName

  const statesMatch =
    (currentState === 'running' &&
      machine.desiredState === GetUpdateStreamResponse_MachineState.MACHINE_STATE_RUNNING) ||
    (currentState === 'stopped' &&
      machine.desiredState === GetUpdateStreamResponse_MachineState.MACHINE_STATE_STOPPED) ||
    (currentState === 'terminated' &&
      machine.desiredState === GetUpdateStreamResponse_MachineState.MACHINE_STATE_DELETED)
  if (statesMatch) return

  const isInTransition = currentState === 'pending' || currentState === 'shutting-down' || currentState === 'stopping'
  if (isInTransition) return

  if (machine.desiredState === GetUpdateStreamResponse_MachineState.MACHINE_STATE_RUNNING) {
    if (currentState === 'terminated') return
    await ec2.send(new StartInstancesCommand({InstanceIds: [current.InstanceId]}))
  }

  if (machine.desiredState === GetUpdateStreamResponse_MachineState.MACHINE_STATE_STOPPED) {
    if (currentState === 'terminated') return
    await ec2.send(new StopInstancesCommand({InstanceIds: [current.InstanceId]}))
  }

  if (machine.desiredState === GetUpdateStreamResponse_MachineState.MACHINE_STATE_DELETED) {
    await ec2.send(new TerminateInstancesCommand({InstanceIds: [current.InstanceId]}))
  }
}

export declare enum VolumeState {
  available = 'available',
  creating = 'creating',
  deleted = 'deleted',
  deleting = 'deleting',
  error = 'error',
  in_use = 'in-use',
}

async function reconcileVolume(state: Record<string, Volume>, volume: GetUpdateStreamResponse_UpdateVolume) {
  const current = state[volume.volumeId]
  if (!current || !current.VolumeId) return
  const currentState = current.State as AwsVolumeState
  const currentAttachment = current?.Attachments?.[0]?.InstanceId

  const statesMatch =
    (currentState === 'available' &&
      volume.desiredState === GetUpdateStreamResponse_VolumeState.VOLUME_STATE_AVAILABLE) ||
    (currentState === 'in-use' &&
      volume.desiredState === GetUpdateStreamResponse_VolumeState.VOLUME_STATE_ATTACHED &&
      currentAttachment === volume.attachedTo) ||
    (currentState === 'deleted' && volume.desiredState === GetUpdateStreamResponse_VolumeState.VOLUME_STATE_DELETED)
  if (statesMatch) return

  const isInTransition = currentState === 'creating' || currentState === 'deleting'
  if (isInTransition) return

  if (volume.desiredState === GetUpdateStreamResponse_VolumeState.VOLUME_STATE_ATTACHED) {
    if (currentState === 'deleted') return
    if (currentState === 'in-use' && currentAttachment !== volume.attachedTo) {
      await ec2.send(new DetachVolumeCommand({VolumeId: current.VolumeId, InstanceId: currentAttachment}))
    } else {
      await ec2.send(
        new AttachVolumeCommand({Device: volume.device!, InstanceId: volume.attachedTo!, VolumeId: current.VolumeId}),
      )
    }
  }

  if (volume.desiredState === GetUpdateStreamResponse_VolumeState.VOLUME_STATE_AVAILABLE) {
    if (currentState === 'deleted') return
    await ec2.send(new DetachVolumeCommand({VolumeId: current.VolumeId}))
  }

  if (volume.desiredState === GetUpdateStreamResponse_VolumeState.VOLUME_STATE_DELETED) {
    await ec2.send(new DeleteVolumeCommand({VolumeId: current.VolumeId}))
  }
}
