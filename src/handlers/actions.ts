import {DeepPartial, SubscribeRequest} from '../proto/depot/cloud/v3/cloud'
import * as aws from '../utils/aws'
import {asyncEmitter} from '../utils/events'
import {client} from '../utils/grpc'

export async function startActionsLoop(signal: AbortSignal) {
  const responseEmitter = asyncEmitter<DeepPartial<SubscribeRequest>>()
  const requestStream = client.subscribe(responseEmitter.stream)

  while (!signal.aborted) {
    for await (const request of requestStream) {
      try {
        if (!request.action || !request.action.kind) throw new Error('Invalid request')
        switch (request.action.kind.$case) {
          case 'createMachine':
            await aws.createMachine(request.action.kind.createMachine)
            break

          case 'createVolume':
            await aws.createVolume(request.action.kind.createVolume)
            break

          case 'updateMachine':
            await aws.updateMachine(request.action.kind.updateMachine)
            break

          case 'updateVolume':
            await aws.updateVolume(request.action.kind.updateVolume)
            break
        }

        responseEmitter.emit({message: {$case: 'success', success: {messageId: request.messageId}}})
      } catch (err: any) {
        responseEmitter.emit({message: {$case: 'error', error: {messageId: request.messageId, message: err.message}}})
      }
    }
  }
}
