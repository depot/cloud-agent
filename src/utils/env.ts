import {config} from 'dotenv'

config()

export const CLOUD_AGENT_TF_MODULE_VERSION = process.env.CLOUD_AGENT_TF_MODULE_VERSION ?? 'devel'
export const CLOUD_AGENT_API_URL = process.env.CLOUD_AGENT_API_URL ?? 'https://api.depot.dev'

export const CLOUD_AGENT_CONNECTION_ID = requiredEnv('CLOUD_AGENT_CONNECTION_ID')
export const CLOUD_AGENT_CONNECTION_TOKEN = requiredEnv('CLOUD_AGENT_CONNECTION_TOKEN')

// Security groups - open allows incoming 443, closed allows nothing
export const CLOUD_AGENT_AWS_SG_BUILDKIT = requiredEnv('CLOUD_AGENT_AWS_SG_BUILDKIT')
export const CLOUD_AGENT_AWS_SG_DEFAULT = requiredEnv('CLOUD_AGENT_AWS_SG_DEFAULT')

export const CLOUD_AGENT_AWS_SUBNET_ID = requiredEnv('CLOUD_AGENT_AWS_SUBNET_ID')

export const CLOUD_AGENT_VERSION = process.env.CLOUD_AGENT_VERSION ?? 'dev'

export const CLOUD_AGENT_USE_CEPH = process.env.CLOUD_AGENT_USE_CEPH

function requiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable ${name}`)
  return value
}
