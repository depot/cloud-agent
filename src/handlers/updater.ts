import {DescribeTasksCommand, ECSClient, ListTasksCommand, StopTaskCommand} from '@aws-sdk/client-ecs'
import {parseISO} from 'date-fns'
import {sleep} from '../utils/common'
import {CLOUD_AGENT_CONNECTION_ID, CLOUD_AGENT_PROVIDER} from '../utils/env'
import {reportError} from '../utils/errors'
import {client} from '../utils/grpc'

const ecs = new ECSClient({})
const cluster = process.env.CLOUD_AGENT_CLUSTER_ARN
const serviceName = process.env.CLOUD_AGENT_SERVICE_NAME

export async function startUpdater(signal: AbortSignal) {
  while (!signal.aborted) {
    try {
      await checkForUpdates()
    } catch (err: any) {
      await reportError(err)
    }
    await sleep(1000 * 60)
  }
}

// Get the newer than date from the API, stop any tasks older than that date
async function checkForUpdates() {
  const req = await client.getActiveAgentVersion({connectionId: CLOUD_AGENT_CONNECTION_ID})

  // TODO: handle updating fly cloud-agent.
  if (CLOUD_AGENT_PROVIDER === 'fly') {
    return
  }

  const newerThan = parseISO(req.newerThan)

  const {taskArns} = await ecs.send(new ListTasksCommand({cluster, serviceName}))
  if (!taskArns || taskArns.length === 0) return
  const {tasks} = await ecs.send(new DescribeTasksCommand({cluster, tasks: taskArns}))
  if (!tasks) return

  for (const task of tasks) {
    if (!task.startedAt) continue
    if (task.startedAt.getTime() >= newerThan.getTime()) continue
    const desiredStatus = task.desiredStatus as TaskLifecycle
    if (desiredStatus !== 'RUNNING') continue
    console.log('Found old task to upgrade', task.taskArn)
    await ecs.send(new StopTaskCommand({cluster, task: task.taskArn, reason: 'Upgrading'}))
  }
}

type TaskLifecycle =
  | 'PROVISIONING'
  | 'PENDING'
  | 'ACTIVATING'
  | 'RUNNING'
  | 'DEACTIVATING'
  | 'STOPPING'
  | 'DEPROVISIONING'
  | 'STOPPED'
  | 'DELETED'
