import {pingHealth, reportCurrentState} from './api'
import {getASGState} from './aws'
import {logger} from './logger'
import {promises} from './utils'

async function currentState() {
  await reportCurrentState(
    await promises({
      autoscalingGroups: getASGState(),
    }),
  )
}

async function main() {
  logger.info('cloud-agent started')

  // Report health to Depot every 10 seconds
  await pingHealth()
  setInterval(() => {
    pingHealth().catch((err) => logger.error(err.message, err))
  }, 10 * 1000)

  // Report autoscaling groups to Depot every 10 seconds
  await currentState()
  setInterval(() => {
    currentState().catch((err) => logger.error(err.message, err))
  }, 10 * 1000)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
