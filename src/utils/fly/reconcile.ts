import {
  GetDesiredStateResponse,
  GetDesiredStateResponse_Architecture,
  GetDesiredStateResponse_Kind,
  GetDesiredStateResponse_MachineChange,
  GetDesiredStateResponse_MachineState,
  GetDesiredStateResponse_NewMachine,
  GetDesiredStateResponse_NewVolume,
  GetDesiredStateResponse_VolumeChange,
  GetDesiredStateResponse_VolumeState,
} from '../../proto/depot/cloud/v5/cloud_pb'
import {promises} from '../common'
import {CLOUD_AGENT_CONNECTION_ID, FLY_REGION} from '../env'
import {errorMessage} from '../errors'
import {client} from '../grpc'
import {logger} from '../logger'
import {toPlainObject} from '../plain'
import {scheduleTask} from '../scheduler'
import {
  createBuildkitGPUVolume,
  createBuildkitVolume,
  launchBuildkitGPUMachine,
  launchBuildkitMachine,
} from './buildkit'
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

export async function reconcile(response: GetDesiredStateResponse, state: CurrentState): Promise<void> {
  logger.info('Reconciling state')

  for (const volume of response.newVolumes) {
    logger.info(`new volume requested: ${JSON.stringify(volume)}`)
    void scheduleTask(`volume/new/${volume.id}`, () => reconcileNewVolume(state.volumes, volume))
  }

  for (const volume of response.volumeChanges) {
    logger.info(`volume change requested: ${JSON.stringify(volume)}`)
    void scheduleTask(`volume/change/${volume.resourceId}`, () => reconcileVolume(state, volume))
  }

  for (const machine of response.newMachines) {
    logger.info(`new machine requested: ${JSON.stringify(machine)}`)
    void scheduleTask(`machine/new/${machine.id}`, () => reconcileNewMachine(state.machines, machine, state.volumes))
  }

  for (const machine of response.machineChanges) {
    logger.info(`machine change requested: ${JSON.stringify(machine)}`)
    void scheduleTask(`machine/change/${machine.resourceId}`, () => reconcileMachine(state.machines, machine))
  }
}

async function reconcileNewVolume(state: Volume[], volume: GetDesiredStateResponse_NewVolume) {
  const existing = state.find((v) => v.name === volume.id)
  if (existing) return

  if (volume.kind === GetDesiredStateResponse_Kind.BUILDKIT_16X32_GPU) {
    console.log(`Creating new gpu volume ${volume.id}`)
    await createBuildkitGPUVolume({depotID: volume.id, region: volume.zone ?? FLY_REGION, sizeGB: volume.size})
  } else {
    console.log(`Creating new volume ${volume.id}`)
    await createBuildkitVolume({depotID: volume.id, region: volume.zone ?? FLY_REGION, sizeGB: volume.size})
  }
}

// fly volumes are not attached/detatched.  The only modification is deleting the volume.
// If the volume is attached to a machine, we delete the machine first.
async function reconcileVolume({volumes, machines}: CurrentState, volume: GetDesiredStateResponse_VolumeChange) {
  if (volume.desiredState !== GetDesiredStateResponse_VolumeState.DELETED) {
    return
  }

  const toDelete = volumes.find((v) => v.id === volume.resourceId)
  if (!toDelete) return

  if (
    toDelete.state !== 'destroyed' &&
    toDelete.state !== 'destroying' &&
    toDelete.state !== 'pending_destroy' &&
    toDelete.state !== 'waiting_for_detach'
  ) {
    console.log(
      `Deleting volume ${volume.resourceId} ${toDelete.name} in state ${toDelete.state} ${
        toDelete.attached_machine_id ?? ''
      }`,
    )
    if (toDelete.attached_machine_id) {
      const machine = machines.find((m) => m.id === toDelete.attached_machine_id)
      if (machine) {
        const deleteMachine = new GetDesiredStateResponse_MachineChange({
          resourceId: machine.id,
          desiredState: GetDesiredStateResponse_MachineState.DELETED,
        })

        console.log(`Deleting machine ${machine.id} ${machine.name} attached to volume ${toDelete.id} ${toDelete.name}`)
        await reconcileMachine(machines, deleteMachine)
      }
    }

    await deleteVolume(toDelete.id)
  }
}

async function reconcileNewMachine(state: V1Machine[], machine: GetDesiredStateResponse_NewMachine, volumes: Volume[]) {
  const existing = state.find((m) => m.name === machine.id)
  if (existing) return
  if (!machine.flyOptions) return
  const flyOptions = machine.flyOptions

  const volume = volumes.find((v) => v.id === flyOptions.volumeId)
  if (!volume) return

  if (machine.architecture !== GetDesiredStateResponse_Architecture.X86) {
    throw new Error('Unsupported architecture, Fly only supports x86 (amd64) machines')
  }

  console.log(`Launching new machine ${machine.id}`)

  const {cpuKind: cpu_kind, cpus, memGBs, needsGPU} = machineKind(machine.kind)
  let req = {
    cpu_kind,
    cpus,
    memGBs,
    depotID: machine.id,
    region: machine.zone ?? FLY_REGION,
    volumeID: volume.id,
    image: machine.image,
    env: {
      DEPOT_CLOUD: 'fly',
      DEPOT_CLOUD_CONNECTION_ID: CLOUD_AGENT_CONNECTION_ID,
      DEPOT_CLOUD_MACHINE_ID: machine.id,
    },
    files: flyOptions.files,
  }

  if (needsGPU) {
    const flyMachine = await launchBuildkitGPUMachine(req)
    if (!flyMachine) throw new Error(`Unable to launch gpu machine ${machine.id}`)
    console.log(`Launched new gpu machine ${machine.id} ${flyMachine.id}`)
    return
  }

  try {
    const flyMachine = await launchBuildkitMachine(req)
    if (!flyMachine) throw new Error(`Unable to launch machine ${machine.id}`)
    console.log(`Launched new machine ${machine.id} ${flyMachine.id}`)
  } catch (err) {
    // If we get a capacity error, delete the volume and try again.
    // We do this because the volume is tied to the machine and we can't detach it.
    if (isCapacityError(err)) {
      console.error(`Capacity error, requesting replacement volume and trying again ${err}`)
      await client.replaceVolume({id: volume.name})
      return
    }

    throw new Error(`Unable to launch machine ${machine.id} with new volume ${volume.name}: ${err}`)
  }
}

function currentMachineState(machine: V1Machine): GetDesiredStateResponse_MachineState {
  const instanceState = machine.state
  if (instanceState === 'started') return GetDesiredStateResponse_MachineState.RUNNING
  if (instanceState === 'stopping') return GetDesiredStateResponse_MachineState.STOPPING
  if (instanceState === 'stopped') return GetDesiredStateResponse_MachineState.STOPPED
  if (instanceState === 'destroying') return GetDesiredStateResponse_MachineState.DELETING
  if (instanceState === 'destroyed') return GetDesiredStateResponse_MachineState.DELETED
  if (instanceState === 'failed') return GetDesiredStateResponse_MachineState.ERROR
  return GetDesiredStateResponse_MachineState.PENDING
}

const timeoutSeconds = 30

async function reconcileMachine(state: V1Machine[], machine: GetDesiredStateResponse_MachineChange) {
  const current = state.find((m) => m.id === machine.resourceId)
  const currentState = current ? currentMachineState(current) : 'unknown'

  // Skip if already at the desired state
  if (currentState === machine.desiredState) return

  if (!current) return

  if (machine.desiredState === GetDesiredStateResponse_MachineState.RUNNING) {
    if (currentState === GetDesiredStateResponse_MachineState.PENDING) return
    if (currentState === GetDesiredStateResponse_MachineState.DELETED) return
    console.log('Starting machine', current.id)
    await startMachine(current.id)
  }

  if (machine.desiredState === GetDesiredStateResponse_MachineState.STOPPED) {
    if (currentState === GetDesiredStateResponse_MachineState.PENDING) return
    if (currentState === GetDesiredStateResponse_MachineState.DELETED) return
    console.log('Stopping machine', current.id)
    await stopAndWait(current)
  }

  if (machine.desiredState === GetDesiredStateResponse_MachineState.DELETED) {
    if (currentState === GetDesiredStateResponse_MachineState.PENDING) return
    if (currentState === GetDesiredStateResponse_MachineState.RUNNING) {
      try {
        await stopAndWait(current)
      } catch {} // stop can sometime fail, ignore.
    }
    // Always force delete to handle the situations when machines cannot be deleted for some reason in the Fly API.
    const force = true
    force ? console.log('Forcing delete of machine', current.id) : console.log('Deleting machine', current.id)
    await deleteMachine(current.id, force)
  }
}

type StopAndWaitParams = Pick<V1Machine, 'id' | 'instance_id'>

// Stop the machine and wait for it to stop.
async function stopAndWait({id, instance_id}: StopAndWaitParams) {
  await stopMachine({id, timeout: timeoutSeconds})
  await waitMachine({
    id,
    instance_id,
    state: 'stopped',
    timeout: timeoutSeconds,
  })
}

function isCapacityError(err: unknown): boolean {
  const message = errorMessage(err).toLowerCase()
  return (
    message.includes('412') && message.includes('insufficient resources to create new machine with existing volume')
  )
}

interface MachineKind {
  cpuKind: 'shared' | 'dedicated' | 'performance'
  cpus: number
  memGBs: number
  needsGPU: boolean
}

function machineKind(kind: GetDesiredStateResponse_Kind): MachineKind {
  switch (kind) {
    case GetDesiredStateResponse_Kind.BUILDKIT_4X4:
      return {cpuKind: 'shared', cpus: 4, memGBs: 4, needsGPU: false}
    case GetDesiredStateResponse_Kind.BUILDKIT_4X8:
      return {cpuKind: 'shared', cpus: 4, memGBs: 8, needsGPU: false}
    case GetDesiredStateResponse_Kind.BUILDKIT_8X8:
      return {cpuKind: 'shared', cpus: 8, memGBs: 8, needsGPU: false}
    case GetDesiredStateResponse_Kind.BUILDKIT_8X16:
      return {cpuKind: 'shared', cpus: 8, memGBs: 16, needsGPU: false}
    case GetDesiredStateResponse_Kind.BUILDKIT_16X32:
      return {cpuKind: 'performance', cpus: 16, memGBs: 32, needsGPU: false}
    case GetDesiredStateResponse_Kind.BUILDKIT_16X32_GPU:
      return {cpuKind: 'performance', cpus: 16, memGBs: 32, needsGPU: true}
    default:
      return {cpuKind: 'shared', cpus: 8, memGBs: 8, needsGPU: false}
  }
}
