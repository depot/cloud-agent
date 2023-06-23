import {execa} from 'execa'
import * as fsp from 'node:fs/promises'

const POOL = 'rbd'

type PoolSpec = string & {readonly $type: unique symbol}
type ImageSpec = string & {readonly $type: unique symbol}
type ClientName = string & {readonly $type: unique symbol}
type OsdProfile = string & {readonly $type: unique symbol}

export function newPoolSpec(volumeName: string): PoolSpec {
  return `${POOL}/${volumeName}` as PoolSpec
}

export function newImageSpec(volumeName: string): ImageSpec {
  return `${POOL}/${volumeName}/${volumeName}` as ImageSpec
}

export function newClientName(name: string): ClientName {
  return name as ClientName
}

export function newOsdProfile(volumeName: string): OsdProfile {
  // Gives a user read-write access to the Ceph Block Devices in namespace.
  return `'profile rbd pool=${POOL} namespace=${volumeName}'` as OsdProfile
}

/*** Low-level Ceph functions ***/

export async function createNamespace(poolSpec: PoolSpec) {
  const {exitCode, stderr} = await execa('rbd', ['namespace', 'create', poolSpec], {reject: false})
  // 17 is "already exists" a.k.a EEXIST.
  if (exitCode === 0 || exitCode === 17) {
    return
  }

  throw new Error(stderr)
}

export async function createBlockDevice(imageSpec: ImageSpec, gigabytes: number) {
  const {exitCode, stderr} = await execa('rbd', ['create', imageSpec, '--size', `${gigabytes}G`], {reject: false})
  // 17 is "already exists" a.k.a EEXIST.
  if (exitCode === 0 || exitCode === 17) {
    return
  }

  throw new Error(stderr)
}

export async function createAuthEntity(name: ClientName) {
  const {exitCode, stderr} = await execa('ceph', ['auth', 'add', name], {reject: false})
  // ceph auth add is idempotent.
  if (exitCode === 0) return

  throw new Error(stderr)
}

export interface Key {
  key: string
}

export async function authGetKey(clientName: ClientName): Promise<Key> {
  const {exitCode, stdout, stderr} = await execa('ceph', ['auth', 'get-key', clientName, '-f', 'json'], {reject: false})
  if (exitCode === 0) {
    const key = JSON.parse(stdout) as Key
    return key
  }

  throw new Error(stderr)
}

export async function authCaps(osdProfile: OsdProfile, clientName: ClientName) {
  // We don't use get-or-create as the caps must always be the same.
  const {exitCode, stderr} = await execa(
    'ceph',
    [
      'auth',
      'caps',
      clientName,
      'mon',
      // TODO: I'm not sure if it is better to have profile rbd here.
      `'allow r'`,
      'osd',
      osdProfile,
    ],
    {reject: false},
  )

  // ceph auth caps is idempotent.
  if (exitCode === 0) return

  throw new Error(stderr)
}

export async function authRm(clientName: ClientName) {
  const {exitCode, stderr} = await execa('ceph', ['auth', 'rm', clientName], {reject: false})
  // ceph auth rm is idempotent.
  if (exitCode === 0) {
    return
  }

  throw new Error(stderr)
}

export async function imageRm(imageSpec: ImageSpec) {
  const {exitCode, stderr} = await execa('rbd', ['rm', imageSpec], {reject: false})
  // 2 is "image does not exist" a.k.a ENOENT.
  if (exitCode === 0 || exitCode === 2) {
    return
  }

  throw new Error(stderr)
}

export async function namespaceRm(poolSpec: PoolSpec) {
  const {exitCode, stderr} = await execa('rbd', ['namespace', 'rm', poolSpec], {reject: false})
  // 2 is "namespace does not exist" a.k.a ENOENT.
  if (exitCode === 0 || exitCode === 2) {
    return
  }

  throw new Error(stderr)
}

export async function cephConfig(): Promise<string> {
  const {exitCode, stdout, stderr} = await execa('ceph', ['config', 'generate-minimal-conf'], {reject: false})
  if (exitCode === 0) {
    return stdout
  }

  throw new Error(stderr)
}

// Creates the ceph.conf and ceph.client.keyring files.
export async function writeCephConf(clientName: string, cephConf: string, key: string) {
  await fsp.mkdir('/etc/ceph', {recursive: true})
  await fsp.chmod('/etc/ceph', 0o700)
  await fsp.writeFile('/etc/ceph/ceph.conf', cephConf)

  const keyringPath = `/etc/ceph/ceph.${clientName}.keyring`
  const keyring = `[${clientName}]
    key = ${key}`
  await fsp.writeFile(keyringPath, keyring)
  await fsp.chmod(keyringPath, 0o600)
}
