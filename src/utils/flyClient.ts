import type {BodyInit} from 'undici'
import {fetch} from 'undici'
import {FLY_API_HOST, FLY_API_TOKEN, FLY_APP_ID} from './env'

export async function listMachines() {
  console.log('listMachines Called')
  const res = await rest<V1Machine[]>('GET', '')
  return res
}

export async function launchMachine(input: LaunchMachineInput) {
  const res = await rest<V1Machine>('POST', '', JSON.stringify(input))
  return res
}

export async function updateMachine(input: LaunchMachineInput) {
  const res = await rest<V1Machine>('POST', `/${input.id}`, JSON.stringify(input))
  return res
}

export async function startMachine(machineID: string) {
  const res = await rest<V1Machine>('POST', `/${machineID}/start`)
  return res
}

export async function waitMachine(machine: V1Machine) {
  const instanceID = machine.instance_id ? `?instance_id=${machine.instance_id}` : ''
  const res = await rest<V1Machine>('POST', `/${machine.id}/wait${instanceID}`)
  return res
}

export async function stopMachine(stopInput: V1MachineStop) {
  const res = await rest<V1Machine>('POST', `/${stopInput.id}/stop`, JSON.stringify(stopInput))
  return res
}

export async function getMachine(machineID: string) {
  const res = await rest<V1Machine>('GET', `/${machineID}`)
  return res
}

export async function destroyMachine(machineID: string, kill = false) {
  const res = await rest<V1Machine>('DELETE', `/${machineID}?kill=${kill}`)
  return res
}

export async function killMachine(machineID: string) {
  const res = await rest<V1Machine>('POST', `/${machineID}/signal`, JSON.stringify({signal: 9}))
  return res
}

const authorizationHeader = `Bearer ${FLY_API_TOKEN}`
async function rest<T>(method: string, endpoint: string, body?: BodyInit): Promise<T> {
  const res = await fetch(`${FLY_API_HOST}/v1/apps/${FLY_APP_ID}/machines${endpoint}`, {
    method,
    body,
    headers: {'Content-Type': 'application/json', Authorization: authorizationHeader},
  })
  if (!res.ok) throw new Error(`Fly API Error: ${res.status} ${res.statusText} ${await res.text()}`)
  return (await res.json()) as T
}

// Types

export interface LaunchMachineInput {
  appId: string
  id?: string
  name?: string
  organizationId: string
  region: string
  config: MachineConfig
}

export interface MachineConfig {
  env?: Record<string, string>
  init?: MachineInit
  image: string
  metadata?: Record<string, string>
  mounts?: MachineMount[]
  restart?: MachineRestart
  services?: any[]
  size?: string
  guest?: MachineGuest
}

export interface MachineInit {
  exec?: string[]
  entryPoint?: string[]
  cmd?: string[]
  tty?: boolean
}

export interface MachineMount {
  encrypted?: boolean
  path: string
  size_gb?: number
  volume: string
}

export type MachineRestart = {policy: 'no'} | {policy: 'on-failure'; max_retries: number} | {policy: 'always'}

export interface MachineGuest {
  cpu_kind: 'shared' | 'dedicated'
  cpus: number
  memory_mb: number
}

export interface V1Machine {
  id: string
  name: string
  state: MachineState
  region: string
  image_ref: {
    registry: string
    repository: string
    tag: string
    digest: string
  }
  instance_id: string
  private_ip: string
  created_at: string
  config: MachineConfig
}

export interface Condition {
  equal?: any
  not_equal?: any
}

export interface V1MachineStop {
  id: string
  signal?: number
  timeout?: number
  filters?: {
    app_name?: string
    machine_state?: Condition[]
    meta?: Record<string, Condition>
  }
}

export type MachineState =
  | 'created' // initial machine status
  | 'started' // steady state, meaning, the machine is usable/accessible
  | 'stopping' // transitioning from started to idle
  | 'starting' // transitioning from idle/stopped to started
  | 'stopped' // machine exited on its own (i.e. not user initiated)
  | 'replacing' // user initiated a configuration change (i.e. image, guest size, etc.), transition state
  | 'replaced' // this specific version is no longer current
  | 'destroying' // user initiated the machine to be completely removed
  | 'destroyed' // machine no longer exists

// Volumes

export interface Volume {
  id: string
  name: string
  sizeGb: number
  region: string
  encrypted: boolean
  state: 'created' | 'deleted'
  createdAt: string
  attachedMachine?: {id: string; name: string}
}

export interface ListVolumeResponse {
  app?: {
    volumes?: {
      nodes?: Volume[]
    } | null
  } | null
}

export async function listVolumes() {
  const res = await graphql<ListVolumeResponse>('listVolumes', listVolumesQuery, {appName: FLY_APP_ID})
  return res.app?.volumes?.nodes ?? []
}

export interface GetVolumeResponse {
  app?: {
    volume?: Volume | null
  } | null
}

export async function getVolume(id: string) {
  const res = await graphql<GetVolumeResponse>('getVolume', getVolumeQuery, {appName: FLY_APP_ID, id})
  return res.app?.volume ?? null
}

export interface CreateVolumeOptions {
  name: string
  sizeGb: number
  region: string
  encrypted?: boolean
}

export interface CreateVolumeResponse {
  createVolume?: {
    app: {name: string}
    volume: Volume
  } | null
}

export async function createVolume(options: CreateVolumeOptions) {
  return await graphql<CreateVolumeResponse>('createVolume', createVolumeMutation, {
    input: {appId: FLY_APP_ID, ...options},
  })
}

export interface DeleteVolumeResponse {
  deleteVolume?: {app: {name: string}} | null
}

export async function deleteVolume(id: string) {
  return await graphql<DeleteVolumeResponse>('deleteVolume', deleteVolumeMutation, {input: {volumeId: id}})
}

async function graphql<T>(operationName: string, query: string, variables: object): Promise<T> {
  const res = await fetch('https://api.fly.io/graphql', {
    method: 'POST',
    headers: {Authorization: `Bearer ${FLY_API_TOKEN}`, 'Content-Type': 'application/json'},
    body: JSON.stringify({operationName, query, variables}),
  })
  if (!res.ok) throw new Error(`Fly API Error: ${res.status} ${res.statusText} ${await res.text()}`)
  const payload = (await res.json()) as GraphQLResponse<T>
  if (payload.errors?.length) {
    throw new Error(`Fly API Error: ${payload.errors.map((err) => err.message).join(', ')}`)
  }
  return payload.data
}

const listVolumesQuery = `
query listVolumes($appName: String!) {
  app(name: $appName) {
    volumes {
      nodes {
        id
        name
        sizeGb
        region
        encrypted
        state
        createdAt
        attachedMachine {
          id
          name
        }
      }
    }
  }
}
`

const getVolumeQuery = `
query getVolume($appName: String!, $id: String!) {
  app(name: $appName) {
    volume(internalId: $id) {
      id
      name
      sizeGb
      region
      encrypted
      state
      createdAt
      attachedMachine {
        id
        name
      }
    }
  }
}
`

const createVolumeMutation = `
mutation createVolume($input: CreateVolumeInput!) {
  createVolume(input: $input) {
    volume {
      id
      name
      sizeGb
      region
      encrypted
      state
      createdAt
      attachedMachine {
        id
        name
      }
    }
  }
}
`

const deleteVolumeMutation = `
mutation deleteVolume($input: DeleteVolumeInput!) {
  deleteVolume(input: $input) {
    app {
      name
    }
  }
}
`

interface GraphQLResponse<T> {
  data: T
  errors?: {message: string}[]
}
