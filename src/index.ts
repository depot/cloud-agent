import {startHealthStream} from './handlers/health'
import {startStateStream} from './handlers/state'
import {startUpdater} from './handlers/updater'
import {sleep} from './utils/common'
import {reportError} from './utils/errors'
import {logger} from './utils/logger'

const controller = new AbortController()

async function main() {
  logger.info('cloud-agent started')
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
      await Promise.all([startHealthStream(signal), startStateStream(signal), startUpdater(signal)])
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
