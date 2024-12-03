import {reportError} from './errors'

const inProgressTasks = new Set<string>()

/**
 * Schedule an update to run, ensuring that only one update is running at a time.
 */
export async function scheduleTask(key: string, task: (key: string) => Promise<void>) {
  if (inProgressTasks.has(key)) {
    return
  }

  const start = new Date()

  try {
    inProgressTasks.add(key)
    return await task(key)
  } catch (err) {
    await reportError(err)
    const duration = new Date().getTime() - start.getTime()
    console.log(`Task ${key} failed (${duration}ms)`)
  } finally {
    inProgressTasks.delete(key)
    const duration = new Date().getTime() - start.getTime()
    console.log(`Task ${key} completed (${duration}ms)`)
  }
}
