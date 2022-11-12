import {reconcile} from '../utils/aws'
import {CLOUD_AGENT_CONNECTION_ID} from '../utils/env'
import {client} from '../utils/grpc'
import {stateCache} from './currentState'

export async function startDesiredStateStream() {
  while (true) {
    try {
      const stream = client.getDesiredState({connectionId: CLOUD_AGENT_CONNECTION_ID})
      for await (const response of stream) {
        const current = stateCache?.state
        if (!current) continue
        await reconcile(response, current)
      }
    } catch (err: any) {
      const message: string = err.message || `${err}`
      await client.reportErrors({connectionId: CLOUD_AGENT_CONNECTION_ID, errors: [message]})
    }
  }
}
