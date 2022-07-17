import {config} from 'dotenv'

config()

export const CLOUD_AGENT_VERSION = process.env.CLOUD_AGENT_VERSION ?? 'devel'
export const CLOUD_AGENT_API_URL = process.env.CLOUD_AGENT_API_URL ?? 'https://depot.dev'

export const CLOUD_AGENT_CONNECTION_ID = requiredEnv('CLOUD_AGENT_CONNECTION_ID')
export const CLOUD_AGENT_API_TOKEN = requiredEnv('CLOUD_AGENT_API_TOKEN')

function requiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable ${name}`)
  return value
}
