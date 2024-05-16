import {execa} from 'execa'
import * as fsp from 'node:fs/promises'
import {CLOUD_AGENT_CEPH_CONFIG} from './env'

const POOL = 'rbd'

type PoolSpec = string & {readonly $type: unique symbol}
type ImageSpec = string & {readonly $type: unique symbol}
type CloneSpec = string & {readonly $type: unique symbol}
type ClientName = string & {readonly $type: unique symbol}
type SnapshotSpec = string & {readonly $type: unique symbol}
type OsdProfile = string & {readonly $type: unique symbol}

export function newPoolSpec(volumeName: string): PoolSpec {
  return `${POOL}/${volumeName}` as PoolSpec
}

export function newImageSpec(volumeName: string): ImageSpec {
  // Assume that if the volume name contains a slash, it is already a full image spec.
  if (volumeName.includes('/')) {
    return volumeName as ImageSpec
  }
  return `${POOL}/${volumeName}/${volumeName}` as ImageSpec
}

export function newCloneSpec(pool: PoolSpec, cloneName: string): CloneSpec {
  return `${pool}/${cloneName}` as CloneSpec
}

export function newClientName(name: string): ClientName {
  return name as ClientName
}

export function newOsdProfile(volumeName: string): OsdProfile {
  // Gives a user read-write access to the Ceph Block Devices in namespace.
  return `profile rbd pool=${POOL} namespace=${volumeName}` as OsdProfile
}

export function newSnapshotSpec(snapshotName: string): SnapshotSpec {
  return snapshotName as SnapshotSpec
}

export function snapshotFromImageSpec(imageSpec: ImageSpec, snapshotName: string): SnapshotSpec {
  return `${imageSpec}@${snapshotName}` as SnapshotSpec
}

/*** Low-level Ceph functions ***/

export async function createNamespace(poolSpec: PoolSpec) {
  console.log('Creating ceph namespace', poolSpec)
  const {exitCode, stderr} = await execa('rbd', ['namespace', 'create', poolSpec], {reject: false, stdio: 'inherit'})
  // 17 is "already exists" a.k.a EEXIST.
  if (exitCode === 0 || exitCode === 17) {
    return
  }

  throw new Error(stderr)
}

export async function createBlockDevice(imageSpec: ImageSpec, gigabytes: number) {
  console.log('Creating ceph block device', imageSpec, gigabytes)
  const {exitCode, stderr} = await execa(
    'rbd',
    ['create', imageSpec, '--size', `${gigabytes}G`, '--stripe-unit', '64K', '--stripe-count', '4'],
    {
      reject: false,
      stdio: 'inherit',
    },
  )
  // 17 is "already exists" a.k.a EEXIST.
  if (exitCode === 0 || exitCode === 17) {
    return
  }

  throw new Error(stderr)
}

export async function createSnapshot(snapshotSpec: SnapshotSpec) {
  console.log('Creating ceph snapshot', snapshotSpec)
  const {exitCode, stderr} = await execa('rbd', ['snap', 'create', snapshotSpec, '--no-progress'], {
    reject: false,
    stdio: 'inherit',
  })
  // 17 is "already exists" a.k.a EEXIST.
  if (exitCode === 0 || exitCode === 17) {
    return
  }

  throw new Error(stderr)
}

export async function createClone(snapshotSpec: SnapshotSpec, cloneSpec: CloneSpec) {
  console.log('Creating ceph clone', snapshotSpec, cloneSpec)
  const {exitCode, stderr} = await execa('rbd', ['clone', snapshotSpec, cloneSpec, '--rbd-default-clone-format=2'], {
    reject: false,
    stdio: 'inherit',
  })
  // 17 is "already exists" a.k.a EEXIST.
  if (exitCode === 0 || exitCode === 17) {
    return
  }

  throw new Error(stderr)
}

export async function createAuthEntity(name: ClientName) {
  console.log('Creating ceph auth entity', name)
  const {exitCode, stderr} = await execa('ceph', ['auth', 'add', name], {reject: false, stdio: 'inherit'})
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
  console.log('Setting ceph auth caps', osdProfile, clientName)
  // We don't use get-or-create as the caps must always be the same.
  const {exitCode, stderr} = await execa(
    'ceph',
    ['auth', 'caps', clientName, 'mon', 'profile rbd', 'osd', osdProfile, 'mgr', osdProfile],
    {reject: false, stdio: 'inherit'},
  )

  // ceph auth caps is idempotent.
  if (exitCode === 0) return

  throw new Error(stderr)
}

export async function authRm(clientName: ClientName) {
  console.log('Removing ceph auth entity', clientName)
  const {exitCode, stderr} = await execa('ceph', ['auth', 'rm', clientName], {reject: false, stdio: 'inherit'})
  // ceph auth rm is idempotent.
  if (exitCode === 0) {
    return
  }

  throw new Error(stderr)
}

export async function imageRm(imageSpec: ImageSpec) {
  console.log('Removing ceph image', imageSpec)
  const {exitCode, stderr} = await execa('rbd', ['rm', '--no-progress', imageSpec], {reject: false, stdio: 'inherit'})
  // 2 is "image does not exist" a.k.a ENOENT.
  if (exitCode === 0 || exitCode === 2) {
    return
  }

  throw new Error(stderr)
}

export async function snapshotRm(snapshotSpec: SnapshotSpec) {
  console.log('Removing ceph snapshot', snapshotSpec)
  const {exitCode, stderr} = await execa('rbd', ['snap', 'rm', snapshotSpec, '--no-progress'], {
    reject: false,
    stdio: 'inherit',
  })
  // 2 is "snapshot does not exist" a.k.a ENOENT.
  if (exitCode === 0 || exitCode === 2) {
    return
  }

  throw new Error(stderr)
}

export async function namespaceRm(poolSpec: PoolSpec) {
  console.log('Removing ceph namespace', poolSpec)
  const {exitCode, stderr} = await execa('rbd', ['namespace', 'rm', poolSpec], {
    reject: false,
    stdio: 'inherit',
  })
  // 2 is "namespace does not exist" a.k.a ENOENT.
  if (exitCode === 0 || exitCode === 2) {
    return
  }

  throw new Error(stderr)
}

export async function enableCephMetrics() {
  console.log('Enabling ceph metrics')
  await execa('ceph', ['config', 'set', 'mgr', 'mgr/prometheus/rbd_stats_pools', '*'], {
    stdio: 'inherit',
  })
}

export async function cephConfig(): Promise<string> {
  // Temporarily use the CLOUD_AGENT_CEPH_CONFIG environment variable if it is set
  if (CLOUD_AGENT_CEPH_CONFIG) return CLOUD_AGENT_CEPH_CONFIG

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
    key = ${key}
`
  await fsp.writeFile(keyringPath, keyring)
  await fsp.chmod(keyringPath, 0o600)
}

export async function sparsify(imageSpec: ImageSpec): Promise<boolean> {
  console.log('Sparsify-ing ceph block device', imageSpec)
  const startTime = new Date()
  const {exitCode, stderr} = await execa('rbd', ['sparsify', '--no-progress', '--sparse-size', '4M', imageSpec], {
    reject: false,
    stdio: 'inherit',
  })

  const endTime = new Date()
  const executionTime = endTime.getTime() - startTime.getTime()

  console.log(`Sparsified ${imageSpec} in ${executionTime} ms`)

  // 2 is "image does not exist" a.k.a ENOENT.
  if (exitCode === 0 || exitCode === 2) {
    return true
  }

  // 30 is "read-only file system" a.k.a EROFS.
  // This means that someone is using this block device and we cannot sparsify it right now.
  if (exitCode === 30) {
    return false
  }

  throw new Error(stderr)
}
