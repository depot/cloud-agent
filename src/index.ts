import {pingHealth} from './api'
import {logger} from './logger'

async function main() {
  logger.info('cloud-agent started')

  // Report health to Depot every 10 seconds
  await pingHealth()
  setInterval(() => {
    pingHealth().catch((err) => logger.error(err.message, err))
  }, 10 * 1000)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
