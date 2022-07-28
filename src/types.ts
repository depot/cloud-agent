// Current State

import {Instance, Volume} from '@aws-sdk/client-ec2'

export interface StateRequest {
  cloud: string
  availabilityZone: string
  instances: Instance[]
  volumes: Volume[]
  errors: string[]
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
  securityGroup: 'open' | 'closed'
}

export interface VolumeDesiredState {
  volumeID: string
  desiredState: string
  attachedTo?: string
  device?: string
}

export interface NewVolumeDesiredState {
  id: string
  size: number
}

export type VolumeStatus = 'creating' | 'available' | 'in-use' | 'deleting' | 'deleted' | 'error'
