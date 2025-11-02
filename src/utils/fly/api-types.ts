export interface APIFlyMachine {
  id: string
  name: string
  state:
    | 'created' // initial machine status
    | 'started' // steady state, meaning, the machine is usable/accessible
    | 'stopping' // transitioning from started to idle
    | 'starting' // transitioning from idle/stopped to started
    | 'stopped' // machine exited on its own (i.e. not user initiated)
    | 'replacing' // user initiated a configuration change (i.e. image, guest size, etc.), transition state
    | 'replaced' // this specific version is no longer current
    | 'destroying' // user initiated the machine to be completely removed
    | 'destroyed' // machine no longer exists
    | 'failed' // machine failed to start
  region: string
  instance_id: string
  private_ip: string
  created_at: string
  config: {
    image: string
    guest?: {
      cpu_kind: 'shared' | 'dedicated' | 'performance'
      cpus: number
      memory_mb: number
    }
  }
}

export interface APIFlyVolume {
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
  region: string
  attached_machine_id?: string
  created_at: string
}
