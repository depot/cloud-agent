import {
  GetDesiredStateResponse_Architecture,
  GetDesiredStateResponse_MachineChange,
  GetDesiredStateResponse_MachineState,
  GetDesiredStateResponse_NewMachine,
  GetDesiredStateResponse_NewVolume,
  GetDesiredStateResponse_VolumeChange,
  GetDesiredStateResponse_VolumeState,
} from '../proto/depot/cloud/v1/cloud'
import {StateRequest} from '../types'
import {promises} from '../utils'
import {FLY_APP_ID, FLY_ORG_ID, FLY_REGION} from '../utils/env'
import * as fly from '../utils/flyClient'
import {getDesiredState, reportState} from './depot'

export async function reconcile(): Promise<string[]> {
  const state: StateRequest = await promises({
    cloud: 'fly',
    region: FLY_REGION,
    machines: fly.listMachines(),
    volumes: fly.listVolumes(),
    errors: [],
  })

  await reportState(state)
  const nextState = await getDesiredState()

  const results = await Promise.allSettled([
    ...nextState.newVolumes.map((volume) => reconcileNewVolume(state.volumes, volume)),
    ...nextState.volumeChanges.map((volume) => reconcileVolume(state.volumes, volume)),
    ...nextState.newMachines.map((machine) => reconcileNewMachine(state.machines, machine, state.volumes)),
    ...nextState.machineChanges.map((machine) => reconcileMachine(state.machines, machine)),
  ])

  return results
    .map((r) => (r.status === 'rejected' ? `${r.reason}` : undefined))
    .filter((r): r is string => r !== undefined)
}

async function reconcileNewVolume(state: fly.Volume[], volume: GetDesiredStateResponse_NewVolume) {
  const existing = state.find((v) => v.name === volume.id)
  if (existing) return
  await fly.createVolume({region: FLY_REGION, name: volume.id, sizeGb: volume.size, encrypted: true})
}

function currentVolumeState(volume: fly.Volume): GetDesiredStateResponse_VolumeState {
  const state = volume.state
  if (!state) return GetDesiredStateResponse_VolumeState.VOLUME_STATE_PENDING
  if (state === 'created' && !volume.attachedMachine) return GetDesiredStateResponse_VolumeState.VOLUME_STATE_AVAILABLE
  if (state === 'created' && volume.attachedMachine) return GetDesiredStateResponse_VolumeState.VOLUME_STATE_ATTACHED
  if (state === 'deleted') return GetDesiredStateResponse_VolumeState.VOLUME_STATE_DELETED
  console.log(`Unknown volume state: ${state}`)
  return GetDesiredStateResponse_VolumeState.VOLUME_STATE_PENDING
}

async function reconcileVolume(state: fly.Volume[], volume: GetDesiredStateResponse_VolumeChange) {
  const current = state.find((v) => v.name === volume.id)
  const currentState = current ? currentVolumeState(current) : 'unknown'
  const currentAttachment = current?.attachedMachine?.name

  // Skip if already at the desired state and attached to the correct machine
  if (
    currentState === volume.desiredState &&
    volume.desiredState !== GetDesiredStateResponse_VolumeState.VOLUME_STATE_ATTACHED
  )
    return
  if (currentState === volume.desiredState && currentAttachment === volume.attachedTo) return

  if (!current) return

  if (volume.desiredState === GetDesiredStateResponse_VolumeState.VOLUME_STATE_ATTACHED) {
    if (currentState === GetDesiredStateResponse_VolumeState.VOLUME_STATE_PENDING) return
    if (currentState === GetDesiredStateResponse_VolumeState.VOLUME_STATE_DELETED) return
    // Volumes in Fly are attached to a machine via the machine's metadata, nothing to do here
  }

  if (volume.desiredState === GetDesiredStateResponse_VolumeState.VOLUME_STATE_AVAILABLE) {
    if (currentState === GetDesiredStateResponse_VolumeState.VOLUME_STATE_PENDING) return
    if (currentState === GetDesiredStateResponse_VolumeState.VOLUME_STATE_DELETED) return
    // Volumes in Fly are attached to a machine via the machine's metadata, nothing to do here
  }

  if (volume.desiredState === GetDesiredStateResponse_VolumeState.VOLUME_STATE_DELETED) {
    if (currentState === GetDesiredStateResponse_VolumeState.VOLUME_STATE_PENDING) return
    await fly.deleteVolume(volume.id)
  }
}

async function reconcileNewMachine(
  state: fly.V1Machine[],
  machine: GetDesiredStateResponse_NewMachine,
  volumes: fly.Volume[],
) {
  const existing = state.find((m) => m.name === machine.id)
  if (existing) return

  const attachedVolume = volumes.find((v) => v.name === machine.volumeId)
  if (!attachedVolume) return

  if (machine.architecture !== GetDesiredStateResponse_Architecture.ARCHITECTURE_X86) {
    throw new Error('Unsupported architecture, Fly only supports x86 (amd64) machines')
  }

  const flyMachine = await fly.launchMachine({
    appId: FLY_APP_ID,
    organizationId: FLY_ORG_ID,
    region: FLY_REGION,
    config: {
      image: machine.image,
      guest: {cpu_kind: 'shared', cpus: 4, memory_mb: 8 * 1024},
      mounts: [{encrypted: false, path: '/var/lib/buildkit', size_gb: 50, volume: attachedVolume.id}],
    },
  })
  if (!flyMachine) throw new Error(`Unable to launch machine ${machine.id}`)
}

function currentMachineState(machine: fly.V1Machine): GetDesiredStateResponse_MachineState {
  const instanceState = machine.state
  if (instanceState === 'started') return GetDesiredStateResponse_MachineState.MACHINE_STATE_RUNNING
  if (instanceState === 'stopping') return GetDesiredStateResponse_MachineState.MACHINE_STATE_STOPPING
  if (instanceState === 'stopped') return GetDesiredStateResponse_MachineState.MACHINE_STATE_STOPPED
  if (instanceState === 'destroying') return GetDesiredStateResponse_MachineState.MACHINE_STATE_DELETING
  if (instanceState === 'destroyed') return GetDesiredStateResponse_MachineState.MACHINE_STATE_DELETED
  return GetDesiredStateResponse_MachineState.MACHINE_STATE_PENDING
}

const timeoutSeconds = 30

async function reconcileMachine(state: fly.V1Machine[], machine: GetDesiredStateResponse_MachineChange) {
  const current = state.find((m) => m.name === machine.id)
  const currentState = current ? currentMachineState(current) : 'unknown'

  // Skip if already at the desired state
  if (currentState === machine.desiredState) return

  if (!current) return

  if (machine.desiredState === GetDesiredStateResponse_MachineState.MACHINE_STATE_RUNNING) {
    if (currentState === GetDesiredStateResponse_MachineState.MACHINE_STATE_PENDING) return
    if (currentState === GetDesiredStateResponse_MachineState.MACHINE_STATE_DELETED) return
    await fly.startMachine(current.id)
  }

  if (machine.desiredState === GetDesiredStateResponse_MachineState.MACHINE_STATE_STOPPED) {
    if (currentState === GetDesiredStateResponse_MachineState.MACHINE_STATE_PENDING) return
    if (currentState === GetDesiredStateResponse_MachineState.MACHINE_STATE_DELETED) return
    await fly.stopMachine({id: current.id, timeout: timeoutSeconds * 1000000000})
  }

  if (machine.desiredState === GetDesiredStateResponse_MachineState.MACHINE_STATE_DELETED) {
    if (currentState === GetDesiredStateResponse_MachineState.MACHINE_STATE_PENDING) return
    await fly.destroyMachine(current.id)
  }
}
