import {V1Machine, Volume, createVolume, launchMachine} from './client'

export interface BuildkitMachineRequest {
  depotID: string
  region: string
  volumeID: string
  image: string
  env: Record<string, string>
  buildkitToml: string
}

export async function launchBuildkitMachine(buildkit: BuildkitMachineRequest): Promise<V1Machine> {
  const {depotID, region, volumeID, image, env, buildkitToml} = buildkit
  const machine = await launchMachine({
    name: depotID,
    region,
    config: {
      guest: {
        cpu_kind: 'shared',
        cpus: 16,
        memory_mb: 1024 * 32,
      },
      files: [
        {
          guest_path: '/etc/buildkit/buildkitd.toml',
          raw_value: Buffer.from(buildkitToml).toString('base64'),
        },
      ],
      init: {
        entryPoint: ['/usr/bin/buildkitd'],
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
