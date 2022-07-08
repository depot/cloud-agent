import {config} from 'dotenv'

config()

export const CLOUD_AGENT_VERSION = process.env.CLOUD_AGENT_VERSION ?? 'devel'
export const DEPOT_API_ENDPOINT = process.env.DEPOT_API_ENDPOINT ?? 'https://depot.dev'

export const CLOUD_AGENT_CONNECTION_ID = requiredEnv('CLOUD_AGENT_CONNECTION_ID')
export const DEPOT_API_TOKEN = requiredEnv('DEPOT_API_TOKEN')

function requiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable ${name}`)
  return value
}
