import {execa} from 'execa'

const POOL = 'rbd'

export function blockDeviceName(projectID: string, architecture: string): string {
  return `${projectID}-${architecture}`
}

export async function newProjectDevice(projectID: string, architecture: string, gigabytes: number): Promise<boolean> {
  return (
    (await createNamespace(POOL, projectID)) &&
    (await createBlockDevice(POOL, projectID, blockDeviceName(projectID, architecture), gigabytes))
  )
}

export async function newWarmInstance(machineID: string): Promise<boolean> {
  return await createAuthEntity(machineID)
}

export async function assignProjectToWarmInstance(projectID: string, machineID: string): Promise<Auth | undefined> {
  return (await authCaps(POOL, projectID, machineID)) ? await authGetJson(machineID) : undefined
}

export async function stopInstance(machineID: string): Promise<boolean> {
  return await authRm(machineID)
}

export async function deleteProject(projectID: string, architecture: string): Promise<boolean> {
  return (
    (await imageRm(POOL, projectID, blockDeviceName(projectID, architecture))) && (await namespaceRm(POOL, projectID))
  )
}

/*** Low-level Ceph functions ***/

export async function createNamespace(pool: string, namespace: string): Promise<boolean> {
  try {
    const {exitCode} = await execa('rbd', ['namespace', 'create', `${pool}/${namespace}`])
    return exitCode == 0
  } catch (e) {
    console.log(e)
    return false
  }
}

export async function createBlockDevice(
  pool: string,
  namespace: string,
  name: string,
  gigabytes: number,
): Promise<boolean> {
  try {
    const {exitCode} = await execa('rbd', ['create', `${pool}/${namespace}/${name}`, '--size', `${gigabytes}G`])
    return exitCode == 0
  } catch (e) {
    console.log(e)
    return false
  }
}

export async function createAuthEntity(name: string): Promise<boolean> {
  try {
    const {exitCode} = await execa('ceph', ['auth', 'add', `client.${name}`])
    return exitCode == 0
  } catch (e) {
    console.log(e)
    return false
  }
}

export async function authCaps(pool: string, namespace: string, name: string): Promise<boolean> {
  try {
    const {exitCode} = await execa('ceph', [
      'auth',
      'caps',
      `client.${name}`,
      'osd',
      // I don't think this is all that we need.
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

export async function authGetJson(name: string): Promise<Auth | undefined> {
  try {
    const {exitCode, stdout} = await execa('ceph', ['auth', 'get', `client.${name}`, '-f', 'json'])
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
    const {exitCode} = await execa('ceph', ['auth', 'rm', `client.${name}`])
    return exitCode == 0
  } catch (e) {
    console.log(e)
    return false
  }
}

export async function imageRm(pool: string, namespace: string, name: string): Promise<boolean> {
  try {
    const {exitCode} = await execa('rbd', ['rm', `${pool}/${namespace}/${name}`])
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
