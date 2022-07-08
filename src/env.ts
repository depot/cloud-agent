import {config} from 'dotenv'

config()

export const CLOUD_AGENT_VERSION = process.env.CLOUD_AGENT_VERSION ?? 'devel'
export const CLOUD_AGENT_CONNECTION_ID = process.env.CLOUD_AGENT_CONNECTION_ID ?? 'devel'
export const DEPOT_API_ENDPOINT = process.env.DEPOT_API_ENDPOINT ?? 'https://depot.dev'
export const DEPOT_API_TOKEN = process.env.DEPOT_API_TOKEN
