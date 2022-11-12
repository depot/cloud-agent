// Current State

import {Instance, Volume} from '@aws-sdk/client-ec2'

export interface CurrentState {
  cloud: 'aws'
  availabilityZone: string
  instances: Record<string, Instance>
  volumes: Record<string, Volume>
}

// Desired State

export interface StateResponse {
  newMachines: NewMachineDesiredState[]
  newVolumes: NewVolumeDesiredState[]
  machineChanges: MachineDesiredState[]
  volumeChanges: VolumeDesiredState[]
}

export type MachineState = 'pending' | 'running' | 'stopped' | 'deleted'

export interface MachineDesiredState {
  machineID: string
  desiredState: MachineState
}

export interface NewMachineDesiredState {
  id: string
  image: string
  realm: string
  kind: string
  architecture: string
  securityGroup: 'buildkit' | 'closed'
}

export type VolumeState = 'pending' | 'available' | 'attached' | 'deleted'

export interface VolumeDesiredState {
  volumeID: string
  desiredState: VolumeState
  attachedTo?: string
  device?: string
}

export interface NewVolumeDesiredState {
  id: string
  size: number
  kind: string
  realm: string
  architecture: string
}

export type AWSVolumeStatus = 'creating' | 'available' | 'in-use' | 'deleting' | 'deleted' | 'error'
