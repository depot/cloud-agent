import type {BodyInit} from 'undici'
import {fetch} from 'undici'
import {FLY_API_HOST, FLY_API_TOKEN, FLY_APP_ID} from '../env'

const authorizationHeader = `Bearer ${FLY_API_TOKEN}`

export async function listMachines(): Promise<V1Machine[]> {
  const res = await rest<V1Machine[]>('GET', '/machines?include_deleted=true')
  return res
}

export async function listVolumes(): Promise<Volume[]> {
  const res = await fetch(`${FLY_API_HOST}/v1/apps/${FLY_APP_ID}/volumes`, {
    method: 'GET',
    headers: {'Content-Type': 'application/json', Authorization: authorizationHeader},
  })
  if (!res.ok) throw new Error(`Fly API Error: ${res.status} ${res.statusText} ${await res.text()}`)

  return (await res.json()) as Volume[]
}

export async function launchMachine(input: LaunchMachineInput) {
  const res = await rest<V1Machine>('POST', '/machines', JSON.stringify(input))
  return res
}

export async function createVolume(req: CreateVolumeRequest) {
  const res = await rest<Volume>('POST', '/volumes', JSON.stringify(req))
  return res
}

export async function startMachine(machineID: string) {
  const res = await rest<StartResponse>('POST', `/machines/${machineID}/start`)
  return res
}

export async function waitMachine(waitInput: MachineWait) {
  const url = new URL(`${FLY_API_HOST}/v1/apps/${FLY_APP_ID}/machines/${waitInput.id}/wait`)

  waitInput.instance_id && url.searchParams.append('instance_id', waitInput.instance_id)
  waitInput.timeout && url.searchParams.append('timeout', waitInput.timeout.toString())
  waitInput.state && url.searchParams.append('state', waitInput.state)

  const res = await fetch(url, {
    headers: {'Content-Type': 'application/json', Authorization: authorizationHeader},
  })
  if (!res.ok) throw new Error(`Fly API Error: ${res.status} ${res.statusText} ${await res.text()}`)
  return (await res.json()) as WaitResponse
}

export async function stopMachine(stopInput: V1MachineStop) {
  const res = await rest<StopResponse>('POST', `/machines/${stopInput.id}/stop`, JSON.stringify(stopInput))
  return res
}

export async function getMachine(machineID: string) {
  const res = await rest<V1Machine>('GET', `/machines/${machineID}`)
  return res
}

export async function deleteMachine(machineID: string, force = false) {
  const res = await rest<DeleteResponse>('DELETE', `/machines/${machineID}?force=${force}`)
  return res
}

export async function deleteVolume(volumeID: string) {
  const res = await rest<Volume>('DELETE', `/volumes/${volumeID}`)
  return res
}

export async function killMachine(machineID: string) {
  return await stopMachine({id: machineID, signal: 'SIGKILL'})
}

async function rest<T>(method: string, endpoint: string, body?: BodyInit): Promise<T> {
  const url = `${FLY_API_HOST}/v1/apps/${FLY_APP_ID}${endpoint}`
  const res = await fetch(url, {
    method,
    body,
    headers: {'Content-Type': 'application/json', Authorization: authorizationHeader},
  })
  if (!res.ok) throw new Error(`Fly API Error: ${res.status} ${res.statusText} ${await res.text()}`)

  return (await res.json()) as T
}

// Types

export interface LaunchMachineInput {
  config: MachineConfig
  lease_ttl?: number
  lvsd?: boolean
  name?: string
  region?: string
  skip_launch?: boolean
  skip_service_registration?: boolean
}

export interface MachineConfig {
  auto_destroy?: boolean
  checks?: MachineCheck[]
  dns: DnsConfig
  env?: Record<string, string>
  files: File[]
  init?: MachineInit
  image: string
  metadata?: Record<string, string>
  metrics?: MachineMetrics
  mounts?: MachineMount[]
  processes?: MachineProcess[]
  restart?: MachineRestart
  schedule?: 'hourly' | 'daily' | 'weekly' | 'monthly'
  services?: MachineService[]
  guest?: MachineGuest
  standbys?: string[]
  statics?: MachineStatic[]
  stop_config?: MachineStopConfig
}

export interface MachineCheck {
  type?: 'http' | 'tcp'
  port?: number
  interval?: number
  timeout?: number
  grace_period?: number
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'TRACE' | 'CONNECT' | 'PATCH'
  path?: string
  protocol?: 'http' | 'https'
  tls_server_name?: string
  tls_skip_verify?: boolean
  headers?: Record<string, string>[]
}

export interface DnsConfig {
  skip_registration?: boolean
}

export type File = {guest_path: string; raw_value: string} | {guest_path: string; secret_name: string}

export interface MachineInit {
  exec?: string[]
  entryPoint?: string[]
  cmd?: string[]
  tty?: boolean
  swap_size_mb?: number
}

export interface MachineMetrics {
  port: number
  path: string
}

export interface MachineMount {
  encrypted?: boolean
  path: string
  size_gb?: number
  volume: string
  name?: string
}

export type MachineRestart = {policy: 'no'} | {policy: 'on-failure'; max_retries: number} | {policy: 'always'}

export interface MachineProcess {
  entryPoint?: string[]
  cmd?: string[]
  env?: Record<string, string>
  exec?: string[]
  user?: string
}

export interface MachineService {
  protocol: 'tcp' | 'udp'
  internal_port: number
  ports: ServicePort[]
  autostart?: boolean
  autostop?: boolean
  // checks
  // concurrency
  force_instance_description?: string
  force_instance_key?: string
  min_machines_running?: number
}

export interface ServicePort {
  protocol: 'tcp' | 'udp'
  port: number
  start_port?: number
  end_port?: number
  force_https?: boolean
  // http_options
  // proxy_proto_options
  // tls_options
}

export interface MachineStatic {
  guest_path: string
  url_prefix: string
}

export interface MachineStopConfig {
  signal?: string
  timeout?: number
}

export interface MachineGuest {
  cpu_kind: 'shared' | 'dedicated' | 'performance'
  gpu_kind?: string
  gpus?: number
  host_dedication_id?: string
  cpus: number
  kernel_args?: string[]
  memory_mb: number
}

// https://fly.io/docs/machines/api/machines-resource/#machine-properties
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
  updated_at: string
  config: MachineConfig
  checks?: CheckStatus[]
  events?: Event[]
  nonce?: string
  worker_status?: string
}

export interface CheckStatus {
  name: string
  output: string
  status: string
  updated_at: string
}

export interface Event {
  id?: string
  type: string
  status: string
  source: string
  timestamp: number
}

export interface Condition {
  equal?: any
  not_equal?: any
}

export interface MachineWait {
  id: string
  instance_id?: string
  timeout?: number
  state: 'started' | 'stopped' | 'destroyed'
}

export interface V1MachineStop {
  id: string
  signal?:
    | 'SIGABRT'
    | 'SIGALRM'
    | 'SIGFPE'
    | 'SIGHUP'
    | 'SIGILL'
    | 'SIGINT'
    | 'SIGKILL'
    | 'SIGPIPE'
    | 'SIGQUIT'
    | 'SIGSEGV'
    | 'SIGTERM'
    | 'SIGTRAP'
    | 'SIGUSR1'
  timeout?: number
}

export interface StopResponse {
  ok: boolean
}

export interface DeleteResponse {
  ok: boolean
}

export interface WaitResponse {
  ok: boolean
}

export interface StartResponse {
  previous_state: MachineState
  migrated: boolean
  new_host?: string
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
  | 'failed'

// Volumes

export interface Volume {
  id: string
  name: string
  state:
    | 'creating'
    | 'created'
    | 'pending_destroy'
    | 'scheduling_destroy'
    | 'destroying'
    | 'waiting_for_detach'
    | 'fork_cleanup'
    | 'destroyed'
  size_gb: number
  region: string
  zone: string // The hardware zone on which the volume resides.
  encrypted: boolean
  attached_machine_id?: string
  attached_alloc_id?: string
  createdAt: string
  blocks: number
  block_size: number
  blocks_free: number
  blocks_avail: number
  fstype: string
  snapshot_retention: number
  auto_backup_enabled: boolean
  worker_status: string
  host_dedication_key: string
}

export interface CreateVolumeRequest {
  name: string
  size_gb: number
  region: string
  compute?: MachineGuest
  compute_image?: string
  encrypted?: boolean
  fstype?: string
  machines_only?: boolean
  require_unique_zone?: boolean
  snapshot_id?: string
  snapshot_retention?: number
  source_volume_id?: string
}
