import {execa} from 'execa'

const POOL = 'rbd'

type PoolSpec = string
type ImageSpec = string
type ClientName = string
type OsdProfile = string

export function newPoolSpec(volumeName: string): PoolSpec {
  return `${POOL}/${volumeName}`
}

export function newImageSpec(volumeName: string): ImageSpec {
  return `${POOL}/${volumeName}/${volumeName}`
}

export function newClientName(name: string): ClientName {
  return `client.${name}`
}

export function newOsdProfile(volumeName: string): OsdProfile {
  // Gives a user read-write access to the Ceph Block Devices in namespace.
  return `'profile rbd pool=${POOL} namespace=${volumeName}'`
}

/*** Low-level Ceph functions ***/

export async function createNamespace(poolSpec: PoolSpec) {
  const {exitCode, stderr} = await execa('rbd', ['namespace', 'create', poolSpec])
  // 17 is "already exists" a.k.a EEXIST.
  if (exitCode == 0 || exitCode == 17) {
    return
  }

  throw new Error(stderr)
}

export async function createBlockDevice(imageSpec: ImageSpec, gigabytes: number) {
  const {exitCode, stderr} = await execa('rbd', ['create', imageSpec, '--size', `${gigabytes}G`])
  // 17 is "already exists" a.k.a EEXIST.
  if (exitCode == 0 || exitCode == 17) {
    return
  }

  throw new Error(stderr)
}

export async function createAuthEntity(name: ClientName) {
  const {exitCode, stderr} = await execa('ceph', ['auth', 'add', name])
  // ceph auth add is idempotent.
  if (exitCode == 0) return

  throw new Error(stderr)
}

export async function authCaps(osdProfile: OsdProfile, clientName: string) {
  // We don't use get-or-create as the caps must always be the same.
  const {exitCode, stderr} = await execa('ceph', [
    'auth',
    'caps',
    clientName,
    'mon',
    // TODO: I'm not sure if it is better to have profile rbd here.
    `'allow r'`,
    'osd',
    osdProfile,
  ])

  // ceph auth caps is idempotent.
  if (exitCode == 0) return

  throw new Error(stderr)
}

export interface Auth {
  entity: string
  key: string
}

export async function authGetJson(clientName: ClientName): Promise<Auth> {
  const {exitCode, stdout, stderr} = await execa('ceph', ['auth', 'get', clientName, '-f', 'json'])
  if (exitCode == 0) {
    // Parse the JSON output into an array of Auth objects
    const auth = JSON.parse(stdout) as Auth[]
    if (auth.length > 0) {
      return auth[0]
    }

    throw new Error(`No auth found for ${clientName}`)
  }

  throw new Error(stderr)
}

export async function authRm(clientName: ClientName) {
  const {exitCode, stderr} = await execa('ceph', ['auth', 'rm', clientName])
  // ceph auth rm is idempotent.
  if (exitCode == 0) {
    return
  }

  throw new Error(stderr)
}

export async function imageRm(imageSpec: ImageSpec) {
  const {exitCode, stderr} = await execa('rbd', ['rm', imageSpec])
  // 2 is "image does not exist" a.k.a ENOENT.
  if (exitCode == 0 || exitCode == 2) {
    return
  }

  throw new Error(stderr)
}

export async function namespaceRm(poolSpec: PoolSpec) {
  const {exitCode, stderr} = await execa('rbd', ['namespace', 'rm', poolSpec])
  // 2 is "namespace does not exist" a.k.a ENOENT.
  if (exitCode == 0 || exitCode == 2) {
    return
  }

  throw new Error(stderr)
}

export async function cephConfig(): Promise<string> {
  const {exitCode, stdout, stderr} = await execa('ceph', ['config', 'generate-minimal-conf'])
  if (exitCode == 0) {
    return stdout
  }

  throw new Error(stderr)
}
