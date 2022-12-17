import {startHandleCreateStream} from './handlers/handleCreate'
import {startHandleUpdateStream} from './handlers/handleUpdate'
import {startHealthStream} from './handlers/health'
import {startUpdater} from './handlers/updater'
import {sleep} from './utils/common'
import {CLOUD_AGENT_VERSION} from './utils/env'
import {reportError} from './utils/errors'
import {logger} from './utils/logger'

const controller = new AbortController()

async function main() {
  logger.info(`cloud-agent ${CLOUD_AGENT_VERSION} started`)
  const signal = controller.signal

  function trapShutdown(signal: 'SIGINT' | 'SIGTERM') {
    process.addListener(signal, async () => {
      process.addListener(signal, () => {
        console.log('Forced shutdown requested...')
        process.exit(1)
      })

      setTimeout(() => {
        console.log('Forcing shutdown due to timeout...')
        process.exit(1)
      }, 25 * 1000).unref()

      console.log('Stopping agent...')
      controller.abort()
    })
  }

  trapShutdown('SIGINT')
  trapShutdown('SIGTERM')

  while (!signal.aborted) {
    try {
      await Promise.all([
        startHealthStream(signal),
        startHandleCreateStream(signal),
        startHandleUpdateStream(signal),
        startUpdater(signal),
      ])
    } catch (err: any) {
      await reportError(err)
    }
    await sleep(1000)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
