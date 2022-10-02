import {config} from 'dotenv'

config()

function requiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable ${name}`)
  return value
}

// Common Configuration

export const CLOUD_PROVIDER = requiredEnv('CLOUD_AGENT_CLOUD_PROVIDER') as 'aws' | 'fly'
if (CLOUD_PROVIDER !== 'aws' && CLOUD_PROVIDER !== 'fly') {
  throw new Error(`Invalid CLOUD_AGENT_CLOUD_PROVIDER: ${CLOUD_PROVIDER}`)
}

export const TF_MODULE_VERSION = process.env.CLOUD_AGENT_TF_MODULE_VERSION ?? 'unknown'
export const API_URL = process.env.CLOUD_AGENT_API_URL ?? 'https://api.depot.dev'

export const CONNECTION_ID = requiredEnv('CLOUD_AGENT_CONNECTION_ID')
export const CONNECTION_TOKEN = requiredEnv('CLOUD_AGENT_CONNECTION_TOKEN')

// AWS Configuration

const isAWS = CLOUD_PROVIDER === 'aws'
export const AWS_AVAILABILITY_ZONE = isAWS ? requiredEnv('CLOUD_AGENT_AWS_AVAILABILITY_ZONE') : 'unknown'
export const AWS_LAUNCH_TEMPLATE_ARM = isAWS ? requiredEnv('CLOUD_AGENT_AWS_LAUNCH_TEMPLATE_ARM') : 'unknown'
export const AWS_LAUNCH_TEMPLATE_X86 = isAWS ? requiredEnv('CLOUD_AGENT_AWS_LAUNCH_TEMPLATE_X86') : 'unknown'
export const AWS_SG_BUILDKIT = isAWS ? requiredEnv('CLOUD_AGENT_AWS_SG_BUILDKIT') : 'unknown'
export const AWS_SG_DEFAULT = isAWS ? requiredEnv('CLOUD_AGENT_AWS_SG_DEFAULT') : 'unknown'
export const AWS_SUBNET_ID = isAWS ? requiredEnv('CLOUD_AGENT_AWS_SUBNET_ID') : 'unknown'

// Fly Configuration

const isFly = CLOUD_PROVIDER === 'fly'
export const FLY_API_HOST = process.env.CLOUD_AGENT_FLY_API_HOST ?? 'http://_api.internal:4280'
export const FLY_API_TOKEN = isFly ? requiredEnv('CLOUD_AGENT_FLY_API_TOKEN') : 'unknown'
export const FLY_APP_ID = isFly ? requiredEnv('CLOUD_AGENT_FLY_APP_ID') : 'unknown'
export const FLY_ORG_ID = isFly ? requiredEnv('CLOUD_AGENT_FLY_ORG_ID') : 'unknown'
export const FLY_REGION = isFly ? requiredEnv('CLOUD_AGENT_FLY_REGION') : 'unknown'
