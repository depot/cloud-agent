import {
  GetDesiredStateResponse,
  GetDesiredStateResponse_Architecture,
  GetDesiredStateResponse_MachineChange,
  GetDesiredStateResponse_MachineState,
  GetDesiredStateResponse_NewMachine,
  GetDesiredStateResponse_NewVolume,
  GetDesiredStateResponse_VolumeChange,
  GetDesiredStateResponse_VolumeState,
} from '../../proto/depot/cloud/v2/cloud_pb'
import {promises} from '../common'
import {CLOUD_AGENT_CONNECTION_ID} from '../env'
import {toPlainObject} from '../plain'
import {createBuildkitVolume, launchBuildkitMachine} from './buildkit'
import {
  V1Machine,
  Volume,
  deleteMachine,
  deleteVolume,
  listMachines,
  listVolumes,
  startMachine,
  stopMachine,
  waitMachine,
} from './client'
import {FLY_REGION} from './env'

export interface CurrentState {
  cloud: 'fly'
  region: string
  machines: V1Machine[]
  volumes: Volume[]
}

export async function getCurrentState() {
  const state: CurrentState = await promises({
    cloud: 'fly',
    region: FLY_REGION,
    machines: listMachines(),
    volumes: listVolumes(),
    errors: [],
  })
  return toPlainObject(state)
}

export async function reconcile(response: GetDesiredStateResponse, state: CurrentState): Promise<string[]> {
  const results = await Promise.allSettled([
    ...response.newVolumes.map((volume) => reconcileNewVolume(state.volumes, volume)),
    ...response.volumeChanges.map((volume) => reconcileVolume(state.volumes, volume)),
    ...response.newMachines.map((machine) => reconcileNewMachine(state.machines, machine, state.volumes)),
    ...response.machineChanges.map((machine) => reconcileMachine(state.machines, machine)),
  ])

  return results
    .map((r) => (r.status === 'rejected' ? `${r.reason}` : undefined))
    .filter((r): r is string => r !== undefined)
}

async function reconcileNewVolume(state: Volume[], volume: GetDesiredStateResponse_NewVolume) {
  const existing = state.find((v) => v.name === volume.id)
  if (existing) return

  console.log(`Creating new volume ${volume.id}`)
  await createBuildkitVolume({depotID: volume.id, region: FLY_REGION, sizeGB: volume.size})
}

// fly volumes are not attached/detatched.  The only modification is deleting the volume.
async function reconcileVolume(state: Volume[], volume: GetDesiredStateResponse_VolumeChange) {
  if (volume.desiredState !== GetDesiredStateResponse_VolumeState.DELETED) {
    return
  }

  const current = state.find((v) => v.name === volume.id)
  if (!current) return

  if (current.state !== 'destroyed' && current.state !== 'destroying') {
    await deleteVolume(volume.id)
  }
}

async function reconcileNewMachine(state: V1Machine[], machine: GetDesiredStateResponse_NewMachine, volumes: Volume[]) {
  const existing = state.find((m) => m.name === machine.id)
  if (existing) return
  if (!machine.flyOptions) return
  const flyOptions = machine.flyOptions

  const attachedVolume = volumes.find((v) => v.name === flyOptions.volumeId)
  if (!attachedVolume) return

  if (machine.architecture !== GetDesiredStateResponse_Architecture.X86) {
    throw new Error('Unsupported architecture, Fly only supports x86 (amd64) machines')
  }

  const flyMachine = await launchBuildkitMachine({
    depotID: machine.id,
    region: FLY_REGION,
    volumeID: flyOptions.volumeId,
    image: machine.image,
    env: {
      DEPOT_CLOUD: 'fly',
      DEPOT_CLOUD_CONNECTION_ID: CLOUD_AGENT_CONNECTION_ID,
      DEPOT_CLOUD_MACHINE_ID: machine.id,
    },
    files: flyOptions.files,
  })

  if (!flyMachine) throw new Error(`Unable to launch machine ${machine.id}`)
}

function currentMachineState(machine: V1Machine): GetDesiredStateResponse_MachineState {
  const instanceState = machine.state
  if (instanceState === 'started') return GetDesiredStateResponse_MachineState.RUNNING
  if (instanceState === 'stopping') return GetDesiredStateResponse_MachineState.STOPPING
  if (instanceState === 'stopped') return GetDesiredStateResponse_MachineState.STOPPED
  if (instanceState === 'destroying') return GetDesiredStateResponse_MachineState.DELETING
  if (instanceState === 'destroyed') return GetDesiredStateResponse_MachineState.DELETED
  return GetDesiredStateResponse_MachineState.PENDING
}

const timeoutSeconds = 30

async function reconcileMachine(state: V1Machine[], machine: GetDesiredStateResponse_MachineChange) {
  const current = state.find((m) => m.name === machine.id)
  const currentState = current ? currentMachineState(current) : 'unknown'

  // Skip if already at the desired state
  if (currentState === machine.desiredState) return

  if (!current) return

  if (machine.desiredState === GetDesiredStateResponse_MachineState.RUNNING) {
    if (currentState === GetDesiredStateResponse_MachineState.PENDING) return
    if (currentState === GetDesiredStateResponse_MachineState.DELETED) return
    await startMachine(current.id)
  }

  if (machine.desiredState === GetDesiredStateResponse_MachineState.STOPPED) {
    if (currentState === GetDesiredStateResponse_MachineState.PENDING) return
    if (currentState === GetDesiredStateResponse_MachineState.DELETED) return
    await stopMachine({id: current.id, timeout: timeoutSeconds * 1_000_000_000})
    await waitMachine({id: current.id, state: 'stopped', timeout: timeoutSeconds * 1_000_000_000})
  }

  if (machine.desiredState === GetDesiredStateResponse_MachineState.DELETED) {
    if (currentState === GetDesiredStateResponse_MachineState.PENDING) return
    if (currentState === GetDesiredStateResponse_MachineState.RUNNING) {
      await stopMachine({id: current.id, timeout: timeoutSeconds * 1_000_000_000})
      await waitMachine({id: current.id, state: 'stopped', timeout: timeoutSeconds * 1_000_000_000})
    }
    await deleteMachine(current.id)
  }
}
