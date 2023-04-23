import {startActionsLoop} from './handlers/actions'
import {startHealthStream} from './handlers/health'
import {startMachineStateLoop} from './handlers/machineState'
import {startUpdater} from './handlers/updater'
import {startVolumeStateLoop} from './handlers/volumeState'
import {CLOUD_AGENT_VERSION} from './utils/env'
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

  startHealthStream(signal)
  startActionsLoop(signal)
  startMachineStateLoop(signal)
  startVolumeStateLoop(signal)
  startUpdater(signal)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
