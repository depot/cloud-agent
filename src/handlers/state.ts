import {PlainMessage} from '@bufbuild/protobuf'
import {Code, ConnectError} from '@connectrpc/connect'
import {compare} from 'fast-json-patch'
import {GetDesiredStateResponse, ReportCurrentStateRequest} from '../proto/depot/cloud/v4/cloud_pb'
import {CurrentState as AwsCurrentState} from '../types'
import {getCurrentState as getCurrentAwsState, reconcile as reconcileAws} from '../utils/aws'
import {clientID} from '../utils/clientID'
import {sleep} from '../utils/common'
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

      const response = await client.getDesiredState({clientId: clientID}, {signal})
      if (isEmptyResponse(response)) continue

      currentState = await provider.getCurrentState()

      const errors = await provider.reconcile(response, currentState)
      for (const error of errors) {
        await reportError(error)
      }
    } catch (err: any) {
      if (err instanceof ConnectError && err.code === Code.FailedPrecondition) {
        // Connection lock was not acquired, sleep and retry
        console.log('Connection lock was not acquired for state stream, sleeping and retrying...')
        await sleep(5 * 1000)
      } else {
        await reportError(err)
      }
    } finally {
      await sleep(1000)
    }
  }
}

interface StateCache<T> {
  state: T
}

function reportAwsState(): (state: AwsCurrentState) => Promise<void> {
  let stateCache: StateCache<AwsCurrentState> | null = null
  return async function reportCurrentState(currentState: AwsCurrentState) {
    const request: PlainMessage<ReportCurrentStateRequest> = {
      clientId: clientID,
      state: {
        state: {
          case: 'aws',
          value: {
            availabilityZone: currentState.availabilityZone,
            state: JSON.stringify(currentState),
          },
        },
      },
    }

    if (stateCache) {
      const diff = compare(stateCache.state, currentState)

      // If there is no difference, don't send a request
      if (diff.length === 0) return
    }

    await client.reportCurrentState(request)
    stateCache = {state: currentState}
  }
}

function reportFlyState(): (state: FlyCurrentState) => Promise<void> {
  let stateCache: StateCache<FlyCurrentState> | null = null
  return async function reportCurrentState(currentState: FlyCurrentState) {
    const request: PlainMessage<ReportCurrentStateRequest> = {
      clientId: clientID,
      state: {
        state: {
          case: currentState.cloud,
          value: {
            region: currentState.region,
            state: JSON.stringify(currentState),
          },
        },
      },
    }

    if (stateCache) {
      const diff = compare(stateCache.state, currentState)

      // If there is no difference, don't send a request
      if (diff.length === 0) return
    }

    await client.reportCurrentState(request)
    stateCache = {state: currentState}
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
