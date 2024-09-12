import {randomUUID} from 'node:crypto'

export const clientID = process.env.FLY_MACHINE_ID ?? randomUUID()
