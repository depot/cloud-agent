import {execa} from 'execa'

const POOL = 'rbd'

export function newImageSpec(volumeName: string): string {
  return `${POOL}/${volumeName}/${volumeName}`
}

export function newClientName(name: string): string {
  return `client.${name}`
}

export async function newVolume(volumeName: string, gigabytes: number): Promise<boolean> {
  const imageSpec = newImageSpec(volumeName)
  return (await createNamespace(POOL, volumeName)) && (await createBlockDevice(imageSpec, gigabytes))
}

export async function authorizeToVolume(volumeName: string, clientName: string): Promise<Auth | undefined> {
  return (await authCaps(POOL, volumeName, clientName)) ? await authGetJson(clientName) : undefined
}

export async function deleteVolume(volumeName: string): Promise<boolean> {
  const imageSpec = newImageSpec(volumeName)
  return (await imageRm(imageSpec)) && (await namespaceRm(POOL, volumeName))
}

/*** Low-level Ceph functions ***/

export async function listNamespaces(pool: string): Promise<string[]> {
  interface Namespace {
    name: string
  }

  const {exitCode, stdout} = await execa('rbd', ['namespace', 'ls', '--format', 'json', pool])
  if (exitCode == 0) {
    const namespaces = JSON.parse(stdout) as Namespace[]
    return namespaces.map((namespace) => namespace.name)
  }
  return []
}

export async function createNamespace(pool: string, namespace: string): Promise<boolean> {
  try {
    const {exitCode} = await execa('rbd', ['namespace', 'create', `${pool}/${namespace}`])
    return exitCode == 0
  } catch (e) {
    console.log(e)
    return false
  }
}

export async function createBlockDevice(imageSpec: string, gigabytes: number): Promise<boolean> {
  try {
    const {exitCode} = await execa('rbd', ['create', imageSpec, '--size', `${gigabytes}G`])
    return exitCode == 0
  } catch (e) {
    console.log(e)
    return false
  }
}

export async function createAuthEntity(name: string): Promise<boolean> {
  try {
    const {exitCode} = await execa('ceph', ['auth', 'add', name])
    return exitCode == 0
  } catch (e) {
    console.log(e)
    return false
  }
}

export async function authCaps(pool: string, namespace: string, clientName: string): Promise<boolean> {
  try {
    const {exitCode} = await execa('ceph', [
      'auth',
      'caps',
      clientName,
      'osd',
      // TODO: I don't think this is all that we need.
      `'profile rbd pool=${pool} namespace=${namespace}'`,
    ])
    return exitCode == 0
  } catch (e) {
    console.log(e)
    return false
  }
}

export interface Auth {
  entity: string
  key: string
}

export async function authGetJson(clientName: string): Promise<Auth | undefined> {
  try {
    const {exitCode, stdout} = await execa('ceph', ['auth', 'get', clientName, '-f', 'json'])
    if (exitCode == 0) {
      // Parse the JSON output into an array of Auth objects
      const auth = JSON.parse(stdout) as Auth[]
      if (auth.length > 0) {
        return auth[0]
      }
    }
  } catch (e) {
    console.log(e)
  }
}

export async function authRm(name: string): Promise<boolean> {
  try {
    const {exitCode} = await execa('ceph', ['auth', 'rm', name])
    return exitCode == 0
  } catch (e) {
    console.log(e)
    return false
  }
}

export async function imageRm(imageSpec: string): Promise<boolean> {
  try {
    const {exitCode} = await execa('rbd', ['rm', imageSpec])
    return exitCode == 0
  } catch (e) {
    console.log(e)
    return false
  }
}

export async function namespaceRm(pool: string, namespace: string): Promise<boolean> {
  try {
    const {exitCode} = await execa('rbd', ['namespace', 'rm', `${pool}/${namespace}`])
    return exitCode == 0
  } catch (e) {
    console.log(e)
    return false
  }
}

export async function cephConfig(): Promise<string | undefined> {
  try {
    const {exitCode, stdout} = await execa('ceph', ['config', 'generate-minimal-conf'])
    if (exitCode == 0) {
      return stdout
    }
  } catch (e) {
    console.log(e)
  }
}

// TODO: note somewhere that we don't use get-or-create as we don't know the caps at that time.
