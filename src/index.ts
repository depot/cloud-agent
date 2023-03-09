import {expressConnectMiddleware} from '@bufbuild/connect-express'
import express from 'express'
import {startHealthStream} from './handlers/health'
import {startStateStream} from './handlers/state'
import {startUpdater} from './handlers/updater'
import {TokenService} from './proto/depot/cloud/v2/token_connect'
import {impl} from './services/cloud.v2/token'
import {CLOUD_AGENT_VERSION} from './utils/env'
import {logger} from './utils/logger'

const controller = new AbortController()

const app = express()
app.use(
  expressConnectMiddleware({
    routes(router) {
      router.service(TokenService, impl)
    },
  }),
)
app.use('/', (_, res) => {
  res.json({message: 'Hello world!'})
})

async function main() {
  logger.info(`cloud-agent ${CLOUD_AGENT_VERSION} started`)
  const signal = controller.signal

  const server = app.listen(process.env.PORT ?? 8080)

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
      server.close()
      controller.abort()
    })
  }

  trapShutdown('SIGINT')
  trapShutdown('SIGTERM')

  startHealthStream(signal)
  startStateStream(signal)
  startUpdater(signal)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
