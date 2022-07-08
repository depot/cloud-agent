import * as http from 'node:http'
import {logger} from './logger'

async function main() {
  logger.info('cloud-agent started')
  http
    .createServer((_, res) => {
      res.setHeader('Content-Type', 'application/json').end(JSON.stringify({ok: true}))
    })
    .listen(3333)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
