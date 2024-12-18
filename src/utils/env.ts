import {config} from 'dotenv'

config()

// CLOUD_AGENT_PROVIDER defines the cloud provider. It defaults to 'aws' but can be 'fly'.
export const CLOUD_AGENT_PROVIDER = process.env.CLOUD_AGENT_PROVIDER ?? 'aws'
export const CLOUD_AGENT_VOLUME_ONLY = process.env.CLOUD_AGENT_VOLUME_ONLY

export const CLOUD_AGENT_API_URL = process.env.CLOUD_AGENT_API_URL ?? 'https://api.depot.dev'

export const CLOUD_AGENT_CONNECTION_ID = requiredEnv('CLOUD_AGENT_CONNECTION_ID')
export const CLOUD_AGENT_CONNECTION_TOKEN = requiredEnv('CLOUD_AGENT_CONNECTION_TOKEN')

export const CLOUD_AGENT_AWS_SG_BUILDKIT = requiredEnv('CLOUD_AGENT_AWS_SG_BUILDKIT')
export const CLOUD_AGENT_AWS_SUBNET_ID = requiredEnv('CLOUD_AGENT_AWS_SUBNET_ID')

export const CLOUD_AGENT_VERSION = process.env.CLOUD_AGENT_VERSION ?? 'dev'

export const CLOUD_AGENT_CEPH_CONFIG = process.env.CLOUD_AGENT_CEPH_CONFIG
export const CLOUD_AGENT_CEPH_KEY = process.env.CLOUD_AGENT_CEPH_KEY

export const FLY_APP_ID = process.env.FLY_APP_ID ?? 'depot-machines'
export const FLY_API_TOKEN = process.env.FLY_API_TOKEN ?? ''
export const FLY_API_HOST = process.env.FLY_API_HOST ?? 'https://api.machines.dev'
export const FLY_REGION = process.env.FLY_REGION ?? 'iad'

function requiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable ${name}`)
  return value
}

interface Subnet {
  arn: string
  availability_zone: string
  cidr_block: string
  id: string
}

export const additionalSubnetIDs = (() => {
  try {
    const data = process.env.CLOUD_AGENT_AWS_SUBNETS
    if (!data) return []
    const subnets: Subnet[] = JSON.parse(data)
    return subnets.map((s) => s.id).filter((id) => id !== CLOUD_AGENT_AWS_SUBNET_ID)
  } catch {
    return []
  }
})()
