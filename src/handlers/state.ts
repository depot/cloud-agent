import {PlainMessage} from '@bufbuild/protobuf'
import {compare} from 'fast-json-patch'
import {ReportCurrentStateRequest} from '../proto/depot/cloud/v2/cloud_pb'
import {CurrentState} from '../types'
import {getCurrentState, reconcile} from '../utils/aws'
import {sleep} from '../utils/common'
import {CLOUD_AGENT_CONNECTION_ID} from '../utils/env'
import {reportError} from '../utils/errors'
import {client} from '../utils/grpc'
import {logger} from '../utils/logger'

export async function startStateStream(signal: AbortSignal) {
  while (!signal.aborted) {
    try {
      logger.info('Getting current AWS state to report')
      let currentState = await getCurrentState()
      await reportCurrentState(currentState)

      logger.info('Getting desired state')
      const {response} = await client.getDesiredStateUnary(
        {request: {connectionId: CLOUD_AGENT_CONNECTION_ID}},
        {signal},
      )
      if (!response) continue

      logger.info('Refreshing current AWS state')
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
  if (stateCache) {
    const diff = compare(stateCache.state, currentState)

    // If there is no difference, don't send a request
    if (diff.length === 0) return

    const request: PlainMessage<ReportCurrentStateRequest> = {
      connectionId: CLOUD_AGENT_CONNECTION_ID,
      state: {
        case: 'patch',
        value: {
          generation: stateCache.generation,
          patch: {
            case: 'aws',
            value: {
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
  const res = await client.reportCurrentState(request)
  stateCache = {state: currentState, generation: res.generation}
}

function toPlainObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}
