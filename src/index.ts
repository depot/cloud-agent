import {startHealthStream} from './handlers/health'
import {startStateStream} from './handlers/state'
import {sleep} from './utils/common'
import {CLOUD_AGENT_CONNECTION_ID} from './utils/env'
import {client} from './utils/grpc'
import {logger} from './utils/logger'

async function main() {
  logger.info('cloud-agent started')

  while (true) {
    try {
      await Promise.all([startHealthStream(), startStateStream()])
    } catch (err: any) {
      const message: string = err.message || `${err}`
      logger.error(message)
      await client.reportErrors({connectionId: CLOUD_AGENT_CONNECTION_ID, errors: [message]})
    }
    await sleep(1000)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
