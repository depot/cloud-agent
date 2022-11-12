import {compare} from 'fast-json-patch'
import {ReportCurrentStateRequest} from '../proto/depot/cloud/v2/cloud'
import {CurrentState} from '../types'
import {getCurrentState, reconcile} from '../utils/aws'
import {CLOUD_AGENT_CONNECTION_ID} from '../utils/env'
import {client} from '../utils/grpc'

export async function startStateStream() {
  while (true) {
    try {
      let currentState = await getCurrentState()
      await reportCurrentState(currentState)

      const stream = client.getDesiredState({connectionId: CLOUD_AGENT_CONNECTION_ID})

      for await (const response of stream) {
        currentState = await getCurrentState()
        await reconcile(response, currentState)
        currentState = await getCurrentState()
        await reportCurrentState(currentState)
      }
    } catch (err: any) {
      const message: string = err.message || `${err}`
      await client.reportErrors({connectionId: CLOUD_AGENT_CONNECTION_ID, errors: [message]})
    }
  }
}

interface StateCache {
  generation: number
  state: CurrentState
}

let stateCache: StateCache | null = null

export async function reportCurrentState(currentState: CurrentState) {
  if (stateCache) {
    const diff = compare(stateCache.state, currentState)

    // If there is no difference, don't send a request
    if (diff.length === 0) return

    const request: ReportCurrentStateRequest = {
      connectionId: CLOUD_AGENT_CONNECTION_ID,
      state: {
        $case: 'patch',
        patch: {
          generation: stateCache.generation,
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
      stateCache = {state: currentState, generation: res.generation}
    } catch {
      // Ignore an error here and fall down to below
    }
  }

  const request: ReportCurrentStateRequest = {
    connectionId: CLOUD_AGENT_CONNECTION_ID,
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
  stateCache = {state: currentState, generation: res.generation}
}

function toPlainObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}