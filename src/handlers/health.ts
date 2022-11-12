import {sleep} from '../utils/common'
import {CLOUD_AGENT_CONNECTION_ID} from '../utils/env'
import {client} from '../utils/grpc'

export async function startHealthStream() {
  async function* sendingStream() {
    while (true) {
      yield {connectionId: CLOUD_AGENT_CONNECTION_ID}
      await sleep(5000)
    }
  }

  while (true) {
    try {
      await client.reportHealth(sendingStream())
    } catch (err: any) {
      const message: string = err.message || `${err}`
      await client.reportErrors({connectionId: CLOUD_AGENT_CONNECTION_ID, errors: [message]})
    }
    await sleep(1000)
  }
}
