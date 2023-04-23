import {Volume} from '@aws-sdk/client-ec2'
import {getAllVolumes} from '../utils/aws'
import {promises, sleep} from '../utils/common'
import {reportError} from '../utils/errors'
import {calculateEtag} from '../utils/etag'
import {client} from '../utils/grpc'

export const highFrequencyWatch = new Set<string>()
export const lowFrequencyWatch = new Set<string>()

export async function startVolumeStateLoop(signal: AbortSignal) {
  while (!signal.aborted) {
    try {
      const currentState = await promises({
        etags: client.getVolumeEtags({}),
        volumes: getAllVolumes(),
      })

      while (!signal.aborted) {
        for (const volume of currentState.volumes) {
          const currentEtag = calculateEtag(volume)
          const volumeID = getVolumeID(volume)
          if (!volumeID) continue

          if (currentEtag !== currentState.etags.etags[volumeID]) {
            await client.reportVolumeState({
              volumeId: volumeID,
              etag: currentEtag,
              state: JSON.stringify(volume),
            })
            currentState.etags.etags[volumeID] = currentEtag
          }
        }

        await sleep(5000)
      }
    } catch (err: any) {
      await reportError(err)
    }
  }
}

function getVolumeID(volume: Volume): string | undefined {
  return volume.Tags?.find((tag) => tag.Key === 'depot-volume-id')?.Value
}
