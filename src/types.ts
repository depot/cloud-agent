// Current State

export interface StateRequest {
  cloud: string
  instances: InstanceState[]
  volumes: VolumeState[]
}

export interface InstanceState {
  id: string
  ip?: string
  state: string
  tags: Record<string, string>
}

export interface VolumeState {
  id: string
  state: string
  attachments: any[]
  tags: Record<string, string>
}

// Desired State

export interface StateResponse {
  instances: InstanceDesiredState[]
  newInstances: NewInstanceDesiredState[]

  volumes: VolumeDesiredState[]
  newVolumes: NewVolumeDesiredState[]
}

export interface InstanceDesiredState {
  instanceID: string
  desiredState: string
}

export interface NewInstanceDesiredState {
  id: string
  ami: string
  architecture: string
}

export interface VolumeDesiredState {
  volumeID: string
  desiredState: string
  attachedTo?: string
  device?: string
}

export interface NewVolumeDesiredState {
  id: string
  volumeID: string
  size: number
}

export type VolumeStatus = 'creating' | 'available' | 'in-use' | 'deleting' | 'deleted' | 'error'
