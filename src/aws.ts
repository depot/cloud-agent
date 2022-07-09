import {
  AutoScalingClient,
  DescribeAutoScalingGroupsCommand,
  TerminateInstanceInAutoScalingGroupCommand,
  UpdateAutoScalingGroupCommand,
} from '@aws-sdk/client-auto-scaling'
import {reportCurrentState} from './api'
import {CLOUD_AGENT_CONNECTION_ID} from './env'
import {logger} from './logger'
import {promises} from './utils'

const client = new AutoScalingClient({})

/** Queries for all managed autoscaling groups */
export async function getASGState() {
  const res = await client.send(
    new DescribeAutoScalingGroupsCommand({
      Filters: [{Name: 'tag:depot-connection', Values: [CLOUD_AGENT_CONNECTION_ID]}],
    }),
  )
  return res.AutoScalingGroups || []
}

export async function reconcile(errors: string[]) {
  const currentState = await promises({
    cloud: 'aws',
    autoscalingGroups: getASGState(),
    errors,
  })

  const nextState = await reportCurrentState(currentState)

  for (const id of nextState.terminate) {
    logger.info(`Terminating autoscaling group instance ${id}`)
    await client.send(
      new TerminateInstanceInAutoScalingGroupCommand({
        InstanceId: id,
        ShouldDecrementDesiredCapacity: true,
      }),
    )
  }

  for (const asg of nextState.autoscalingGroups) {
    const current = currentState.autoscalingGroups.find((x) => x.AutoScalingGroupName === asg.name)

    // Skip if ASG is already at the desired state
    if (current?.MaxSize === asg.max && current?.DesiredCapacity === asg.desired) continue

    logger.info(`Updating ${asg.name} to ${asg.max}/${asg.desired}`)
    await client.send(
      new UpdateAutoScalingGroupCommand({
        AutoScalingGroupName: asg.name,
        MaxSize: asg.max,
        DesiredCapacity: asg.desired,
      }),
    )
  }
}
