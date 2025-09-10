import {reportError} from './errors'

const inProgressTasks = new Set<string>()
const completedTasks = new Set<string>()

/**
 * Schedule an update to run, ensuring that only one update is running at a time.
 */
export async function scheduleTask(key: string, task: () => Promise<void>) {
  if (inProgressTasks.has(key) || completedTasks.has(key)) {
    console.log(`Skipping ${key} because it is already in progress or completed`)
    return
  }

  const start = new Date()

  try {
    inProgressTasks.add(key)
    console.log(`Accepted ${key}, starting task`)
    return await task()
  } catch (err) {
    await reportError(err)
  } finally {
    inProgressTasks.delete(key)
    completedTasks.add(key)
    const duration = new Date().getTime() - start.getTime()
    console.log(`Task ${key} completed (${duration}ms)`)
  }
}

/**
 * Clear completed tasks, allowing them to be scheduled again.
 * This should be called at the beginning of each reconciliation loop.
 */
export function clearCompletedTasks() {
  const count = completedTasks.size
  if (count > 0) {
    console.log(`Clearing ${count} completed task(s)`)
    completedTasks.clear()
  }
}
