// Current State

import {Instance, Volume} from '@aws-sdk/client-ec2'

export interface CurrentState {
  cloud: 'aws'
  availabilityZone: string
  availabilityZones: string[]
  instances: Record<string, Instance>
  volumes: Record<string, Volume>
}
