import {isAbortError} from 'abort-controller-x'
import {CLOUD_AGENT_CONNECTION_ID} from './env'
import {client} from './grpc'
import {logger} from './logger'

export async function reportError(err: any) {
  try {
    if (isAbortError(err)) return
    const message: string = err.message || `${err}`

    // Ignore stream termination errors
    if (message.includes('deadline_exceeded')) return
    if (message.includes('missing EndStreamResponse')) return

    logger.error(message)
    await client.reportErrors({connectionId: CLOUD_AGENT_CONNECTION_ID, errors: [message]})
  } catch (err: any) {
    logger.error(`Failed to report error: ${err.message || err}`)
  }
}
