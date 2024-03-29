import {PlainMessage} from '@bufbuild/protobuf'
import {compare} from 'fast-json-patch'
import {GetDesiredStateResponse, ReportCurrentStateRequest} from '../proto/depot/cloud/v2/cloud_pb'
import {CurrentState} from '../types'
import {getCurrentState, reconcile} from '../utils/aws'
import {sleep} from '../utils/common'
import {CLOUD_AGENT_CONNECTION_ID} from '../utils/env'
import {reportError} from '../utils/errors'
import {client} from '../utils/grpc'

export async function startStateStream(signal: AbortSignal) {
  while (!signal.aborted) {
    try {
      let currentState = await getCurrentState()

      await reportCurrentState(currentState)

      const {response} = await client.getDesiredStateUnary(
        {request: {connectionId: CLOUD_AGENT_CONNECTION_ID}},
        {signal},
      )
      if (!response || isEmptyResponse(response)) continue

      currentState = await getCurrentState()

      const errors = await reconcile(response, currentState)
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

interface StateCache {
  generation: number
  state: CurrentState
}

let stateCache: StateCache | null = null

export async function reportCurrentState(currentState: CurrentState) {
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

function isEmptyResponse(response: GetDesiredStateResponse): boolean {
  return (
    response.newMachines.length === 0 &&
    response.newVolumes.length === 0 &&
    response.machineChanges.length === 0 &&
    response.volumeChanges.length === 0
  )
}
