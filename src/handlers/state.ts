import {PlainMessage} from '@bufbuild/protobuf'
import {compare} from 'fast-json-patch'
import {GetDesiredStateResponse, ReportCurrentStateRequest} from '../proto/depot/cloud/v2/cloud_pb'
import {CurrentState as AwsCurrentState} from '../types'
import {getCurrentState as getCurrentAwsState, reconcile as reconcileAws} from '../utils/aws'
import {sleep} from '../utils/common'
import {CLOUD_AGENT_CONNECTION_ID} from '../utils/env'
import {reportError} from '../utils/errors'
import {
  CurrentState as FlyCurrentState,
  getCurrentState as getCurrentFlyState,
  reconcile as reconcileFly,
} from '../utils/fly/reconcile'
import {client} from '../utils/grpc'

interface CloudProvider<T> {
  getCurrentState(): Promise<T>
  reportCurrentState(currentState: T): Promise<void>
  reconcile(response: GetDesiredStateResponse, state: T): Promise<string[]>
}

export const AwsProvider: CloudProvider<AwsCurrentState> = {
  getCurrentState: () => getCurrentAwsState(),
  reportCurrentState: reportAwsState(),
  reconcile: (response, currentState) => reconcileAws(response, currentState),
}

export const FlyProvider: CloudProvider<FlyCurrentState> = {
  getCurrentState: () => getCurrentFlyState(),
  reportCurrentState: reportFlyState(),
  reconcile: (response, currentState) => reconcileFly(response, currentState),
}

export async function startStateStream<T>(signal: AbortSignal, provider: CloudProvider<T>) {
  while (!signal.aborted) {
    try {
      let currentState = await provider.getCurrentState()

      await provider.reportCurrentState(currentState)

      const {response} = await client.getDesiredStateUnary(
        {request: {connectionId: CLOUD_AGENT_CONNECTION_ID}},
        {signal},
      )
      if (!response || isEmptyResponse(response)) continue

      currentState = await provider.getCurrentState()

      const errors = await provider.reconcile(response, currentState)
      for (const error of errors) {
        await reportError(error)
      }
    } catch (err: any) {
      await reportError(err)
    } finally {
      await sleep(1000)
    }
  }
}

interface StateCache<T> {
  generation: number
  state: T
}

function reportAwsState(): (state: AwsCurrentState) => Promise<void> {
  let stateCache: StateCache<AwsCurrentState> | null = null
  return async function reportCurrentState(currentState: AwsCurrentState) {
    const request: PlainMessage<ReportCurrentStateRequest> = {
      connectionId: CLOUD_AGENT_CONNECTION_ID,
      state: {
        case: 'replace',
        value: {
          state: {
            case: 'aws',
            value: {
              availabilityZone: currentState.availabilityZone,
              state: JSON.stringify(currentState),
            },
          },
        },
      },
    }

    if (stateCache) {
      const diff = compare(stateCache.state, currentState)

      // If there is no difference, don't send a request
      if (diff.length === 0) return
    }

    const res = await client.reportCurrentState(request)
    stateCache = {state: currentState, generation: res.generation}
  }
}
function reportFlyState(): (state: FlyCurrentState) => Promise<void> {
  let stateCache: StateCache<FlyCurrentState> | null = null
  return async function reportCurrentState(currentState: FlyCurrentState) {
    const request: PlainMessage<ReportCurrentStateRequest> = {
      connectionId: CLOUD_AGENT_CONNECTION_ID,
      state: {
        case: 'replace',
        value: {
          state: {
            case: currentState.cloud,
            value: {
              region: currentState.region,
              state: JSON.stringify(currentState),
            },
          },
        },
      },
    }

    if (stateCache) {
      const diff = compare(stateCache.state, currentState)

      // If there is no difference, don't send a request
      if (diff.length === 0) return
    }

    const res = await client.reportCurrentState(request)
    stateCache = {state: currentState, generation: res.generation}
  }
}

function isEmptyResponse(response: GetDesiredStateResponse): boolean {
  return (
    response.newMachines.length === 0 &&
    response.newVolumes.length === 0 &&
    response.machineChanges.length === 0 &&
    response.volumeChanges.length === 0
  )
}
