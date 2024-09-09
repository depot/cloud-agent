import {isAbortError} from 'abort-controller-x'
import {client, recreateClient} from './grpc'
import {logger} from './logger'

export async function reportError(err: any) {
  try {
    if (isAbortError(err)) return
    const message = errorMessage(err)

    // Ignore stream termination errors
    if (message.includes('deadline_exceeded')) return
    if (message.includes('missing EndStreamResponse')) return

    logger.error(message)

    if (message.includes('New streams cannot be created after receiving a GOAWAY')) {
      logger.error('Recreating gRPC client')
      recreateClient()
    }

    await client.reportErrors({errors: [message]})
  } catch (err: any) {
    logger.error(`Failed to report error: ${err.stack || err.message || err}`)
  }
}

export function errorMessage(err: any): string {
  const message: string = err.stack || err.message || `${err}`
  return message
}
