// Current State

import {Instance, Volume} from '@aws-sdk/client-ec2'
import * as fly from './utils/flyClient'

export type StateRequest = AWSStateRequest | FlyStateRequest

export interface AWSStateRequest {
  cloud: 'aws'
  availabilityZone: string
  instances: Instance[]
  volumes: Volume[]
}

export interface FlyStateRequest {
  cloud: 'fly'
  region: string
  machines: fly.V1Machine[]
  volumes: fly.Volume[]
}
