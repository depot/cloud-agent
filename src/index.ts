import {reconcile} from './providers/aws'
import {sleep} from './utils'
import {logger} from './utils/logger'

let errorsToReport: string[] = []
async function main() {
  logger.info('cloud-agent started')

  while (true) {
    try {
      const errors = [...errorsToReport]
      errorsToReport = []
      await reconcile(errors)
    } catch (e: any) {
      logger.error(e.toString())
      errorsToReport.push(e.message || `${e}`)
    }
    await sleep(1000)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
