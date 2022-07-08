const levels: Record<string, number> = {error: 1, warn: 2, info: 3, debug: 4}
const LOG_LEVEL = levels[process.env.LOG_LEVEL ?? 'info']
if (LOG_LEVEL === undefined) {
  throw new Error(`Unknown LOG_LEVEL ${process.env.LOG_LEVEL}, expected: ${Object.keys(levels).join(', ')}`)
}

/** Basic JSON logger */
class Logger {
  info(message: string, context: object = {}) {
    if (LOG_LEVEL < levels.info) return
    this.log('INFO', message, context)
  }

  warn(message: string, context: object = {}) {
    if (LOG_LEVEL < levels.warn) return
    this.log('WARN', message, context)
  }

  error(message: string, context: object = {}) {
    if (LOG_LEVEL < levels.error) return
    this.log('ERROR', message, context)
  }

  debug(message: string, context: object = {}) {
    if (LOG_LEVEL < levels.debug) return
    this.log('DEBUG', message, context)
  }

  private log(severity: string, message: string, context: object = {}) {
    const timestamp = new Date().toISOString()
    console.log(JSON.stringify({severity, message, timestamp, ...context}))
  }
}

export const logger = new Logger()
