import {reportError} from './errors'

const inProgressTasks = new Set<string>()

/**
 * Schedule an update to run, ensuring that only one update is running at a time.
 */
export async function scheduleTask(key: string, task: () => Promise<void>) {
  if (inProgressTasks.has(key)) {
    console.log(`Skipping ${key} because it is already in progress`)
    return
  }

  try {
    inProgressTasks.add(key)
    console.log(`Accepted ${key}, starting task`)
    return await task()
  } catch (err) {
    await reportError(err)
  } finally {
    inProgressTasks.delete(key)
    console.log(`Task ${key} completed`)
  }
}
