import {AwsProvider, FlyProvider, startStateStream} from './handlers/state'
import {startUpdater} from './handlers/updater'
import {startVolumeStream} from './handlers/volumes'
import {writeCephConf} from './utils/ceph'
import {clientID} from './utils/clientID'
import {sleep} from './utils/common'
import {
  CLOUD_AGENT_CEPH_CONFIG,
  CLOUD_AGENT_CEPH_KEY,
  CLOUD_AGENT_CONNECTION_ID,
  CLOUD_AGENT_PROVIDER,
  CLOUD_AGENT_VERSION,
  CLOUD_AGENT_VOLUME_ONLY,
} from './utils/env'
import {client} from './utils/grpc'
import {logger} from './utils/logger'

const controller = new AbortController()

async function main() {
  logger.info(`cloud-agent ${CLOUD_AGENT_VERSION} started: ${clientID}`)
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

  const check = await client.getActiveAgentVersion({connectionId: CLOUD_AGENT_CONNECTION_ID}, {signal})
  if (check.connectionDeleted) {
    console.log('The connection has been deleted, please uninstall.')
    console.log('Sleeping for 5 minutes, then shutting down...')
    await sleep(5 * 60 * 1000)
    process.exit(1)
  }

  // Volume only mode only handles ceph volume requests.
  if (!CLOUD_AGENT_VOLUME_ONLY) {
    switch (CLOUD_AGENT_PROVIDER) {
      case 'fly':
        startStateStream(signal, FlyProvider)
        break
      case 'aws':
        startStateStream(signal, AwsProvider)
        break
      default:
        startStateStream(signal, AwsProvider)
    }
  }

  startUpdater(signal)
  if (CLOUD_AGENT_CEPH_CONFIG && CLOUD_AGENT_CEPH_KEY) {
    await writeCephConf('client.admin', CLOUD_AGENT_CEPH_CONFIG, CLOUD_AGENT_CEPH_KEY)
    startVolumeStream(signal)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
