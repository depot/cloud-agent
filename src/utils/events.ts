import EventEmitter from 'events'
import {on} from 'events-to-async'

export function asyncEmitter<T>() {
  const responses = new EventEmitter()

  const responseStream = on<T[]>((handler) => {
    responses.on('data', handler)
    return () => responses.off('data', handler)
  })

  return {
    emit: (data: T) => responses.emit('data', data),
    stream: (async function* () {
      for await (const responses of responseStream) {
        yield* responses
      }
    })(),
  }
}
