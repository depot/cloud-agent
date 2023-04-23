import {isAbortError} from 'abort-controller-x'
import {client} from './grpc'
import {logger} from './logger'

export async function reportError(err: any) {
  try {
    if (isAbortError(err)) return
    const message: string = err.message || `${err}`
    logger.error(message)
    await client.reportErrors({errors: [message]})
  } catch (err: any) {
    logger.error(`Failed to report error: ${err.message || err}`)
  }
}
