import {AutoScalingClient, DescribeAutoScalingGroupsCommand} from '@aws-sdk/client-auto-scaling'
import {CLOUD_AGENT_CONNECTION_ID} from './env'

const client = new AutoScalingClient({})

/** Queries for all managed autoscaling groups */
export async function getASGState() {
  const res = await client.send(
    new DescribeAutoScalingGroupsCommand({
      Filters: [{Name: 'tag:depot-connection', Values: [CLOUD_AGENT_CONNECTION_ID]}],
    }),
  )
  return res.AutoScalingGroups
}
