import {sleep} from '../utils/common'
import {reportError} from '../utils/errors'
import {client} from '../utils/grpc'

export async function startHealthStream(signal: AbortSignal) {
  async function* sendingStream() {
    while (!signal.aborted) {
      yield {}
      await sleep(5000)
    }
  }

  while (!signal.aborted) {
    try {
      await client.reportHealth(sendingStream(), {signal})
    } catch (err: any) {
      await reportError(err)
    }
    await sleep(1000)
  }
}
