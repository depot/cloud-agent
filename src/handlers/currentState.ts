import {compare} from 'fast-json-patch'
import {ReportCurrentStateRequest} from '../proto/depot/cloud/v2/cloud'
import {CurrentState} from '../types'
import {getCurrentState} from '../utils/aws'
import {sleep} from '../utils/common'
import {CLOUD_AGENT_CONNECTION_ID} from '../utils/env'
import {client} from '../utils/grpc'

interface StateCache {
  generation: number
  state: CurrentState
}

export let stateCache: StateCache | null = null

export async function startCurrentStateStream() {
  while (true) {
    try {
      await reportCurrentState()
    } catch (err: any) {
      const message: string = err.message || `${err}`
      await client.reportErrors({connectionId: CLOUD_AGENT_CONNECTION_ID, errors: [message]})
    }
    await sleep(1000)
  }
}

export async function reportCurrentState() {
  const state = await getCurrentState()
  const current: CurrentState = toPlainObject(state)

  if (stateCache) {
    const diff = compare(stateCache.state, current)

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
    const res = await client.reportCurrentState(request)
    stateCache = {state: current, generation: res.generation}
  }

  const request: ReportCurrentStateRequest = {
    connectionId: CLOUD_AGENT_CONNECTION_ID,
    state: {
      $case: 'replace',
      replace: {
        state: {
          $case: 'aws',
          aws: {
            availabilityZone: current.availabilityZone,
            state: JSON.stringify(current),
          },
        },
      },
    },
  }
  const res = await client.reportCurrentState(request)
  stateCache = {state: current, generation: res.generation}
}

function toPlainObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}
