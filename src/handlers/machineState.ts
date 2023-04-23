import {Instance} from '@aws-sdk/client-ec2'
import {getAllInstances} from '../utils/aws'
import {promises, sleep} from '../utils/common'
import {reportError} from '../utils/errors'
import {calculateEtag} from '../utils/etag'
import {client} from '../utils/grpc'

export const highFrequencyWatch = new Set<string>()
export const lowFrequencyWatch = new Set<string>()

export async function startMachineStateLoop(signal: AbortSignal) {
  while (!signal.aborted) {
    try {
      const currentState = await promises({
        etags: client.getMachineEtags({}),
        instances: getAllInstances(),
      })

      while (!signal.aborted) {
        for (const instance of currentState.instances) {
          const currentEtag = calculateEtag(instance)
          const machineID = getMachineID(instance)
          if (!machineID) continue

          if (currentEtag !== currentState.etags.etags[machineID]) {
            await client.reportMachineState({
              machineId: machineID,
              etag: currentEtag,
              state: JSON.stringify(instance),
            })
            currentState.etags.etags[machineID] = currentEtag
          }
        }

        await sleep(5000)
      }
    } catch (err: any) {
      await reportError(err)
    }
  }
}

function getMachineID(instance: Instance): string | undefined {
  return instance.Tags?.find((tag) => tag.Key === 'depot-machine-id')?.Value
}
