import {V1Machine, Volume, createVolume, launchMachine} from './client'
import {shard} from './shard'

export interface FlyBuildkitMachineRequest {
  cpu_kind: 'shared' | 'dedicated' | 'performance'
  cpus: number
  memGBs: number
  depotID: string
  region: string
  volumeID: string
  image: string
  env: Record<string, string>
  files: Record<string, string>
}

export async function launchBuildkitMachine(req: FlyBuildkitMachineRequest): Promise<V1Machine> {
  const {cpu_kind, cpus, memGBs, depotID, region, volumeID, image, env, files} = req
  const machine = await launchMachine({
    shard: shard(depotID),
    name: depotID,
    region,
    config: {
      guest: {
        cpu_kind,
        cpus,
        memory_mb: 1024 * memGBs,
      },
      files: Object.entries(files).map(([guest_path, raw_value]) => ({
        guest_path,
        raw_value: Buffer.from(raw_value).toString('base64'),
      })),
      init: {
        entryPoint: ['/usr/bin/machine-agent'],
      },
      env,
      image,
      mounts: [
        {
          encrypted: false,
          path: '/var/lib/buildkit',
          volume: volumeID,
        },
      ],
      auto_destroy: false,
      restart: {policy: 'no'},
      dns: {},
    },
  })
  return machine
}

const GPU_KIND = 'a10'

export async function launchBuildkitGPUMachine(buildkit: FlyBuildkitMachineRequest): Promise<V1Machine> {
  const {cpu_kind, cpus, memGBs, depotID, region, volumeID, image, env, files} = buildkit
  if (region !== 'ord') {
    throw new Error('GPU machines are only available in the ord region')
  }

  const machine = await launchMachine({
    shard: shard(depotID),
    name: depotID,
    region,
    config: {
      guest: {
        cpu_kind,
        cpus,
        memory_mb: 1024 * memGBs,
        gpus: 1,
        gpu_kind: GPU_KIND,
      },
      files: Object.entries(files).map(([guest_path, raw_value]) => ({
        guest_path,
        raw_value: Buffer.from(raw_value).toString('base64'),
      })),
      init: {
        entryPoint: ['/usr/bin/entrypoint.sh'],
      },
      env,
      image,
      mounts: [
        {
          encrypted: false,
          path: '/var/lib/buildkit',
          volume: volumeID,
        },
      ],
      auto_destroy: false,
      restart: {policy: 'no'},
      dns: {},
    },
  })
  return machine
}

export interface BuildkitVolumeRequest {
  depotID: string
  region: string
  sizeGB: number
}

export async function createBuildkitVolume(req: BuildkitVolumeRequest): Promise<Volume> {
  const {depotID, region, sizeGB} = req
  const volume = await createVolume({
    name: depotID,
    region,
    size_gb: sizeGB,
    snapshot_retention: 5, // 5 is fly's minimum value.
    encrypted: false,
    fstype: 'ext4',
  })
  return volume
}

export async function createBuildkitGPUVolume(req: BuildkitVolumeRequest): Promise<Volume> {
  const {depotID, region, sizeGB} = req
  const volume = await createVolume({
    name: depotID,
    region,
    size_gb: sizeGB,
    snapshot_retention: 5, // 5 is fly's minimum value.
    encrypted: false,
    fstype: 'ext4',
    compute: {
      cpu_kind: 'performance',
      cpus: 16,
      memory_mb: 1024 * 32,
      gpus: 1,
      gpu_kind: GPU_KIND,
    },
  })
  return volume
}
