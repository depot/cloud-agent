import {config} from 'dotenv'

config()

export const DEPOT_API_ENDPOINT = process.env.DEPOT_API_ENDPOINT ?? 'https://depot.dev'
export const DEPOT_API_TOKEN = process.env.DEPOT_API_TOKEN
