import {Code, ConnectError} from '@connectrpc/connect'
import {GetDesiredStateResponse} from '../proto/depot/cloud/v5/cloud_pb'
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

interface CloudProvider<T extends AwsCurrentState | FlyCurrentState> {
  getCurrentState(): Promise<T>
  reconcile(response: GetDesiredStateResponse, state: T): Promise<void>
}

export const AwsProvider: CloudProvider<AwsCurrentState> = {
  getCurrentState: () => getCurrentAwsState(),
  reconcile: (response, currentState) => reconcileAws(response, currentState),
}

export const FlyProvider: CloudProvider<FlyCurrentState> = {
  getCurrentState: () => getCurrentFlyState(),
  reconcile: (response, currentState) => reconcileFly(response, currentState),
}

export async function startStateStream<T extends AwsCurrentState | FlyCurrentState>(
  signal: AbortSignal,
  provider: CloudProvider<T>,
) {
  while (!signal.aborted) {
    try {
      const currentState = await provider.getCurrentState()

      const response = await client.getDesiredState(
        {
          clientId: clientID,
          currentState: {
            state:
              currentState.cloud === 'aws'
                ? {
                    case: 'aws',
                    value: {
                      availabilityZone: currentState.availabilityZone,
                      state: JSON.stringify(currentState),
                    },
                  }
                : {
                    case: 'fly',
                    value: {
                      region: currentState.region,
                      state: JSON.stringify(currentState),
                    },
                  },
          },
        },
        {signal},
      )
      if (isEmptyResponse(response)) continue

      await provider.reconcile(response, currentState)
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

function isEmptyResponse(response: GetDesiredStateResponse): boolean {
  return (
    response.newMachines.length === 0 &&
    response.newVolumes.length === 0 &&
    response.machineChanges.length === 0 &&
    response.volumeChanges.length === 0
  )
}
