import {DescribeInstancesCommand, DescribeVolumesCommand, Instance, Volume} from '@aws-sdk/client-ec2'
import {compare} from 'fast-json-patch'
import {ReportCurrentStateRequest} from '../proto/depot/cloud/v3/cloud'
import {CurrentState} from '../types'
import {ec2} from './aws'
import {promises} from './common'
import {CLOUD_AGENT_CONNECTION_ID} from './env'
import {client} from './grpc'

export async function getCurrentState() {
  const state: CurrentState = await promises({
    cloud: 'aws',
    availabilityZone: process.env.CLOUD_AGENT_AWS_AVAILABILITY_ZONE ?? 'unknown',
    instances: getInstancesState(),
    volumes: getVolumesState(),
    errors: [],
  })
  return toPlainObject(state)
}

/** Filter to select only Depot-managed resources */
const tagFilter = {Name: 'tag:depot-connection', Values: [CLOUD_AGENT_CONNECTION_ID]}

/** Queries for all managed instances */
async function getInstancesState() {
  const res = await ec2.send(new DescribeInstancesCommand({Filters: [tagFilter]}))
  const instances = res.Reservations?.flatMap((r) => r.Instances || []) || []
  return instances.reduce((acc, instance) => {
    if (!instance.InstanceId) return acc
    acc[instance.InstanceId] = instance
    return acc
  }, {} as Record<string, Instance>)
}

/** Queries for all managed volumes */
async function getVolumesState() {
  const res = await ec2.send(new DescribeVolumesCommand({Filters: [tagFilter]}))
  const volumes = res.Volumes || []
  return volumes.reduce((acc, volume) => {
    if (!volume.VolumeId) return acc
    acc[volume.VolumeId] = volume
    return acc
  }, {} as Record<string, Volume>)
}

interface StateCache {
  etag: string
  state: CurrentState
}

let stateCache: StateCache | null = null

export async function reportCurrentState(currentState: CurrentState) {
  if (stateCache) {
    const diff = compare(stateCache.state, currentState)

    // If there is no difference, don't send a request
    if (diff.length === 0) return

    const request: ReportCurrentStateRequest = {
      state: {
        $case: 'patch',
        patch: {
          etag: stateCache.etag,
          patch: {
            $case: 'aws',
            aws: {
              patch: JSON.stringify(diff),
            },
          },
        },
      },
    }

    try {
      const res = await client.reportCurrentState(request)
      stateCache = {state: currentState, etag: res.etag}
    } catch {
      // Ignore an error here and fall down to below
    }
  }

  const request: ReportCurrentStateRequest = {
    state: {
      $case: 'replace',
      replace: {
        state: {
          $case: 'aws',
          aws: {
            availabilityZone: currentState.availabilityZone,
            state: JSON.stringify(currentState),
          },
        },
      },
    },
  }
  const res = await client.reportCurrentState(request)
  stateCache = {state: currentState, etag: res.etag}
}

function toPlainObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}
