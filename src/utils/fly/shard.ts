import crc32 from 'crc/crc32'
import Queue from 'p-queue'
import {V1Machine, listFilteredMachines} from './client'

const NUM_SHARDS = 10

export function shard(name: string) {
  return (crc32(name) % NUM_SHARDS).toString()
}

// We sharded machines so we can get the list of all machines in parallel.
export async function shardedListMachines(): Promise<V1Machine[]> {
  const queue = new Queue({concurrency: NUM_SHARDS})
  let machines: V1Machine[] = []
  for (let shard = 0; shard < NUM_SHARDS; shard++) {
    void queue.add(async () => {
      const res = await listFilteredMachines('shard', shard.toString())
      machines.push(...res)
    })
  }

  await queue.onIdle()
  return machines
}
