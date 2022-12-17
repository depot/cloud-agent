/* eslint-disable */
import type {CallContext, CallOptions} from 'nice-grpc-common'
import _m0 from 'protobufjs/minimal'

export const protobufPackage = 'depot.cloud.v3'

export interface GetCreateStreamRequest {}

export interface GetCreateStreamResponse {
  resource?:
    | {$case: 'machine'; machine: GetCreateStreamResponse_CreateMachine}
    | {
        $case: 'volume'
        volume: GetCreateStreamResponse_CreateVolume
      }
}

export enum GetCreateStreamResponse_Architecture {
  ARCHITECTURE_UNSPECIFIED = 0,
  ARCHITECTURE_X86_64 = 1,
  ARCHITECTURE_ARM64 = 2,
  UNRECOGNIZED = -1,
}

export function getCreateStreamResponse_ArchitectureFromJSON(object: any): GetCreateStreamResponse_Architecture {
  switch (object) {
    case 0:
    case 'ARCHITECTURE_UNSPECIFIED':
      return GetCreateStreamResponse_Architecture.ARCHITECTURE_UNSPECIFIED
    case 1:
    case 'ARCHITECTURE_X86_64':
      return GetCreateStreamResponse_Architecture.ARCHITECTURE_X86_64
    case 2:
    case 'ARCHITECTURE_ARM64':
      return GetCreateStreamResponse_Architecture.ARCHITECTURE_ARM64
    case -1:
    case 'UNRECOGNIZED':
    default:
      return GetCreateStreamResponse_Architecture.UNRECOGNIZED
  }
}

export function getCreateStreamResponse_ArchitectureToJSON(object: GetCreateStreamResponse_Architecture): string {
  switch (object) {
    case GetCreateStreamResponse_Architecture.ARCHITECTURE_UNSPECIFIED:
      return 'ARCHITECTURE_UNSPECIFIED'
    case GetCreateStreamResponse_Architecture.ARCHITECTURE_X86_64:
      return 'ARCHITECTURE_X86_64'
    case GetCreateStreamResponse_Architecture.ARCHITECTURE_ARM64:
      return 'ARCHITECTURE_ARM64'
    case GetCreateStreamResponse_Architecture.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED'
  }
}

export enum GetCreateStreamResponse_SecurityGroup {
  SECURITY_GROUP_UNSPECIFIED = 0,
  SECURITY_GROUP_DEFAULT = 1,
  SECURITY_GROUP_BUILDKIT = 2,
  UNRECOGNIZED = -1,
}

export function getCreateStreamResponse_SecurityGroupFromJSON(object: any): GetCreateStreamResponse_SecurityGroup {
  switch (object) {
    case 0:
    case 'SECURITY_GROUP_UNSPECIFIED':
      return GetCreateStreamResponse_SecurityGroup.SECURITY_GROUP_UNSPECIFIED
    case 1:
    case 'SECURITY_GROUP_DEFAULT':
      return GetCreateStreamResponse_SecurityGroup.SECURITY_GROUP_DEFAULT
    case 2:
    case 'SECURITY_GROUP_BUILDKIT':
      return GetCreateStreamResponse_SecurityGroup.SECURITY_GROUP_BUILDKIT
    case -1:
    case 'UNRECOGNIZED':
    default:
      return GetCreateStreamResponse_SecurityGroup.UNRECOGNIZED
  }
}

export function getCreateStreamResponse_SecurityGroupToJSON(object: GetCreateStreamResponse_SecurityGroup): string {
  switch (object) {
    case GetCreateStreamResponse_SecurityGroup.SECURITY_GROUP_UNSPECIFIED:
      return 'SECURITY_GROUP_UNSPECIFIED'
    case GetCreateStreamResponse_SecurityGroup.SECURITY_GROUP_DEFAULT:
      return 'SECURITY_GROUP_DEFAULT'
    case GetCreateStreamResponse_SecurityGroup.SECURITY_GROUP_BUILDKIT:
      return 'SECURITY_GROUP_BUILDKIT'
    case GetCreateStreamResponse_SecurityGroup.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED'
  }
}

export interface GetCreateStreamResponse_CreateMachine {
  requestId: string
  architecture: GetCreateStreamResponse_Architecture
  image: string
  securityGroup: GetCreateStreamResponse_SecurityGroup
}

export interface GetCreateStreamResponse_CreateVolume {
  requestId: string
  size: number
}

export interface GetUpdateStreamRequest {}

export interface GetUpdateStreamResponse {
  machines: GetUpdateStreamResponse_UpdateMachine[]
  volumes: GetUpdateStreamResponse_UpdateVolume[]
}

export enum GetUpdateStreamResponse_MachineState {
  MACHINE_STATE_UNSPECIFIED = 0,
  MACHINE_STATE_RUNNING = 1,
  MACHINE_STATE_STOPPED = 2,
  MACHINE_STATE_DELETED = 3,
  UNRECOGNIZED = -1,
}

export function getUpdateStreamResponse_MachineStateFromJSON(object: any): GetUpdateStreamResponse_MachineState {
  switch (object) {
    case 0:
    case 'MACHINE_STATE_UNSPECIFIED':
      return GetUpdateStreamResponse_MachineState.MACHINE_STATE_UNSPECIFIED
    case 1:
    case 'MACHINE_STATE_RUNNING':
      return GetUpdateStreamResponse_MachineState.MACHINE_STATE_RUNNING
    case 2:
    case 'MACHINE_STATE_STOPPED':
      return GetUpdateStreamResponse_MachineState.MACHINE_STATE_STOPPED
    case 3:
    case 'MACHINE_STATE_DELETED':
      return GetUpdateStreamResponse_MachineState.MACHINE_STATE_DELETED
    case -1:
    case 'UNRECOGNIZED':
    default:
      return GetUpdateStreamResponse_MachineState.UNRECOGNIZED
  }
}

export function getUpdateStreamResponse_MachineStateToJSON(object: GetUpdateStreamResponse_MachineState): string {
  switch (object) {
    case GetUpdateStreamResponse_MachineState.MACHINE_STATE_UNSPECIFIED:
      return 'MACHINE_STATE_UNSPECIFIED'
    case GetUpdateStreamResponse_MachineState.MACHINE_STATE_RUNNING:
      return 'MACHINE_STATE_RUNNING'
    case GetUpdateStreamResponse_MachineState.MACHINE_STATE_STOPPED:
      return 'MACHINE_STATE_STOPPED'
    case GetUpdateStreamResponse_MachineState.MACHINE_STATE_DELETED:
      return 'MACHINE_STATE_DELETED'
    case GetUpdateStreamResponse_MachineState.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED'
  }
}

export enum GetUpdateStreamResponse_VolumeState {
  VOLUME_STATE_UNSPECIFIED = 0,
  VOLUME_STATE_AVAILABLE = 1,
  VOLUME_STATE_ATTACHED = 2,
  VOLUME_STATE_DELETED = 3,
  UNRECOGNIZED = -1,
}

export function getUpdateStreamResponse_VolumeStateFromJSON(object: any): GetUpdateStreamResponse_VolumeState {
  switch (object) {
    case 0:
    case 'VOLUME_STATE_UNSPECIFIED':
      return GetUpdateStreamResponse_VolumeState.VOLUME_STATE_UNSPECIFIED
    case 1:
    case 'VOLUME_STATE_AVAILABLE':
      return GetUpdateStreamResponse_VolumeState.VOLUME_STATE_AVAILABLE
    case 2:
    case 'VOLUME_STATE_ATTACHED':
      return GetUpdateStreamResponse_VolumeState.VOLUME_STATE_ATTACHED
    case 3:
    case 'VOLUME_STATE_DELETED':
      return GetUpdateStreamResponse_VolumeState.VOLUME_STATE_DELETED
    case -1:
    case 'UNRECOGNIZED':
    default:
      return GetUpdateStreamResponse_VolumeState.UNRECOGNIZED
  }
}

export function getUpdateStreamResponse_VolumeStateToJSON(object: GetUpdateStreamResponse_VolumeState): string {
  switch (object) {
    case GetUpdateStreamResponse_VolumeState.VOLUME_STATE_UNSPECIFIED:
      return 'VOLUME_STATE_UNSPECIFIED'
    case GetUpdateStreamResponse_VolumeState.VOLUME_STATE_AVAILABLE:
      return 'VOLUME_STATE_AVAILABLE'
    case GetUpdateStreamResponse_VolumeState.VOLUME_STATE_ATTACHED:
      return 'VOLUME_STATE_ATTACHED'
    case GetUpdateStreamResponse_VolumeState.VOLUME_STATE_DELETED:
      return 'VOLUME_STATE_DELETED'
    case GetUpdateStreamResponse_VolumeState.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED'
  }
}

export interface GetUpdateStreamResponse_UpdateMachine {
  instanceId: string
  desiredState: GetUpdateStreamResponse_MachineState
}

export interface GetUpdateStreamResponse_UpdateVolume {
  volumeId: string
  desiredState: GetUpdateStreamResponse_VolumeState
  attachedTo?: string | undefined
  device?: string | undefined
}

export interface ReportCurrentStateRequest {
  state?:
    | {$case: 'replace'; replace: ReportCurrentStateRequest_CloudState}
    | {
        $case: 'patch'
        patch: ReportCurrentStateRequest_CloudStatePatch
      }
}

export interface ReportCurrentStateRequest_CloudState {
  state?: {$case: 'aws'; aws: ReportCurrentStateRequest_CloudState_Aws}
}

export interface ReportCurrentStateRequest_CloudState_Aws {
  availabilityZone: string
  state: string
}

export interface ReportCurrentStateRequest_CloudStatePatch {
  etag: string
  patch?: {$case: 'aws'; aws: ReportCurrentStateRequest_CloudStatePatch_Aws}
}

export interface ReportCurrentStateRequest_CloudStatePatch_Aws {
  patch: string
}

export interface ReportCurrentStateResponse {
  etag: string
}

export interface ReportErrorsRequest {
  errors: string[]
}

export interface ReportErrorsResponse {}

export interface ReportHealthRequest {}

export interface ReportHealthResponse {}

export interface GetActiveAgentVersionRequest {}

export interface GetActiveAgentVersionResponse {
  newerThan: string
}

function createBaseGetCreateStreamRequest(): GetCreateStreamRequest {
  return {}
}

export const GetCreateStreamRequest = {
  encode(_: GetCreateStreamRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetCreateStreamRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseGetCreateStreamRequest()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(_: any): GetCreateStreamRequest {
    return {}
  },

  toJSON(_: GetCreateStreamRequest): unknown {
    const obj: any = {}
    return obj
  },

  fromPartial(_: DeepPartial<GetCreateStreamRequest>): GetCreateStreamRequest {
    const message = createBaseGetCreateStreamRequest()
    return message
  },
}

function createBaseGetCreateStreamResponse(): GetCreateStreamResponse {
  return {resource: undefined}
}

export const GetCreateStreamResponse = {
  encode(message: GetCreateStreamResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.resource?.$case === 'machine') {
      GetCreateStreamResponse_CreateMachine.encode(message.resource.machine, writer.uint32(10).fork()).ldelim()
    }
    if (message.resource?.$case === 'volume') {
      GetCreateStreamResponse_CreateVolume.encode(message.resource.volume, writer.uint32(18).fork()).ldelim()
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetCreateStreamResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseGetCreateStreamResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.resource = {
            $case: 'machine',
            machine: GetCreateStreamResponse_CreateMachine.decode(reader, reader.uint32()),
          }
          break
        case 2:
          message.resource = {
            $case: 'volume',
            volume: GetCreateStreamResponse_CreateVolume.decode(reader, reader.uint32()),
          }
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): GetCreateStreamResponse {
    return {
      resource: isSet(object.machine)
        ? {$case: 'machine', machine: GetCreateStreamResponse_CreateMachine.fromJSON(object.machine)}
        : isSet(object.volume)
        ? {$case: 'volume', volume: GetCreateStreamResponse_CreateVolume.fromJSON(object.volume)}
        : undefined,
    }
  },

  toJSON(message: GetCreateStreamResponse): unknown {
    const obj: any = {}
    message.resource?.$case === 'machine' &&
      (obj.machine = message.resource?.machine
        ? GetCreateStreamResponse_CreateMachine.toJSON(message.resource?.machine)
        : undefined)
    message.resource?.$case === 'volume' &&
      (obj.volume = message.resource?.volume
        ? GetCreateStreamResponse_CreateVolume.toJSON(message.resource?.volume)
        : undefined)
    return obj
  },

  fromPartial(object: DeepPartial<GetCreateStreamResponse>): GetCreateStreamResponse {
    const message = createBaseGetCreateStreamResponse()
    if (
      object.resource?.$case === 'machine' &&
      object.resource?.machine !== undefined &&
      object.resource?.machine !== null
    ) {
      message.resource = {
        $case: 'machine',
        machine: GetCreateStreamResponse_CreateMachine.fromPartial(object.resource.machine),
      }
    }
    if (
      object.resource?.$case === 'volume' &&
      object.resource?.volume !== undefined &&
      object.resource?.volume !== null
    ) {
      message.resource = {
        $case: 'volume',
        volume: GetCreateStreamResponse_CreateVolume.fromPartial(object.resource.volume),
      }
    }
    return message
  },
}

function createBaseGetCreateStreamResponse_CreateMachine(): GetCreateStreamResponse_CreateMachine {
  return {requestId: '', architecture: 0, image: '', securityGroup: 0}
}

export const GetCreateStreamResponse_CreateMachine = {
  encode(message: GetCreateStreamResponse_CreateMachine, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.requestId !== '') {
      writer.uint32(10).string(message.requestId)
    }
    if (message.architecture !== 0) {
      writer.uint32(16).int32(message.architecture)
    }
    if (message.image !== '') {
      writer.uint32(26).string(message.image)
    }
    if (message.securityGroup !== 0) {
      writer.uint32(32).int32(message.securityGroup)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetCreateStreamResponse_CreateMachine {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseGetCreateStreamResponse_CreateMachine()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.requestId = reader.string()
          break
        case 2:
          message.architecture = reader.int32() as any
          break
        case 3:
          message.image = reader.string()
          break
        case 4:
          message.securityGroup = reader.int32() as any
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): GetCreateStreamResponse_CreateMachine {
    return {
      requestId: isSet(object.requestId) ? String(object.requestId) : '',
      architecture: isSet(object.architecture) ? getCreateStreamResponse_ArchitectureFromJSON(object.architecture) : 0,
      image: isSet(object.image) ? String(object.image) : '',
      securityGroup: isSet(object.securityGroup)
        ? getCreateStreamResponse_SecurityGroupFromJSON(object.securityGroup)
        : 0,
    }
  },

  toJSON(message: GetCreateStreamResponse_CreateMachine): unknown {
    const obj: any = {}
    message.requestId !== undefined && (obj.requestId = message.requestId)
    message.architecture !== undefined &&
      (obj.architecture = getCreateStreamResponse_ArchitectureToJSON(message.architecture))
    message.image !== undefined && (obj.image = message.image)
    message.securityGroup !== undefined &&
      (obj.securityGroup = getCreateStreamResponse_SecurityGroupToJSON(message.securityGroup))
    return obj
  },

  fromPartial(object: DeepPartial<GetCreateStreamResponse_CreateMachine>): GetCreateStreamResponse_CreateMachine {
    const message = createBaseGetCreateStreamResponse_CreateMachine()
    message.requestId = object.requestId ?? ''
    message.architecture = object.architecture ?? 0
    message.image = object.image ?? ''
    message.securityGroup = object.securityGroup ?? 0
    return message
  },
}

function createBaseGetCreateStreamResponse_CreateVolume(): GetCreateStreamResponse_CreateVolume {
  return {requestId: '', size: 0}
}

export const GetCreateStreamResponse_CreateVolume = {
  encode(message: GetCreateStreamResponse_CreateVolume, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.requestId !== '') {
      writer.uint32(10).string(message.requestId)
    }
    if (message.size !== 0) {
      writer.uint32(16).int32(message.size)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetCreateStreamResponse_CreateVolume {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseGetCreateStreamResponse_CreateVolume()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.requestId = reader.string()
          break
        case 2:
          message.size = reader.int32()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): GetCreateStreamResponse_CreateVolume {
    return {
      requestId: isSet(object.requestId) ? String(object.requestId) : '',
      size: isSet(object.size) ? Number(object.size) : 0,
    }
  },

  toJSON(message: GetCreateStreamResponse_CreateVolume): unknown {
    const obj: any = {}
    message.requestId !== undefined && (obj.requestId = message.requestId)
    message.size !== undefined && (obj.size = Math.round(message.size))
    return obj
  },

  fromPartial(object: DeepPartial<GetCreateStreamResponse_CreateVolume>): GetCreateStreamResponse_CreateVolume {
    const message = createBaseGetCreateStreamResponse_CreateVolume()
    message.requestId = object.requestId ?? ''
    message.size = object.size ?? 0
    return message
  },
}

function createBaseGetUpdateStreamRequest(): GetUpdateStreamRequest {
  return {}
}

export const GetUpdateStreamRequest = {
  encode(_: GetUpdateStreamRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUpdateStreamRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseGetUpdateStreamRequest()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(_: any): GetUpdateStreamRequest {
    return {}
  },

  toJSON(_: GetUpdateStreamRequest): unknown {
    const obj: any = {}
    return obj
  },

  fromPartial(_: DeepPartial<GetUpdateStreamRequest>): GetUpdateStreamRequest {
    const message = createBaseGetUpdateStreamRequest()
    return message
  },
}

function createBaseGetUpdateStreamResponse(): GetUpdateStreamResponse {
  return {machines: [], volumes: []}
}

export const GetUpdateStreamResponse = {
  encode(message: GetUpdateStreamResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.machines) {
      GetUpdateStreamResponse_UpdateMachine.encode(v!, writer.uint32(10).fork()).ldelim()
    }
    for (const v of message.volumes) {
      GetUpdateStreamResponse_UpdateVolume.encode(v!, writer.uint32(18).fork()).ldelim()
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUpdateStreamResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseGetUpdateStreamResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.machines.push(GetUpdateStreamResponse_UpdateMachine.decode(reader, reader.uint32()))
          break
        case 2:
          message.volumes.push(GetUpdateStreamResponse_UpdateVolume.decode(reader, reader.uint32()))
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): GetUpdateStreamResponse {
    return {
      machines: Array.isArray(object?.machines)
        ? object.machines.map((e: any) => GetUpdateStreamResponse_UpdateMachine.fromJSON(e))
        : [],
      volumes: Array.isArray(object?.volumes)
        ? object.volumes.map((e: any) => GetUpdateStreamResponse_UpdateVolume.fromJSON(e))
        : [],
    }
  },

  toJSON(message: GetUpdateStreamResponse): unknown {
    const obj: any = {}
    if (message.machines) {
      obj.machines = message.machines.map((e) => (e ? GetUpdateStreamResponse_UpdateMachine.toJSON(e) : undefined))
    } else {
      obj.machines = []
    }
    if (message.volumes) {
      obj.volumes = message.volumes.map((e) => (e ? GetUpdateStreamResponse_UpdateVolume.toJSON(e) : undefined))
    } else {
      obj.volumes = []
    }
    return obj
  },

  fromPartial(object: DeepPartial<GetUpdateStreamResponse>): GetUpdateStreamResponse {
    const message = createBaseGetUpdateStreamResponse()
    message.machines = object.machines?.map((e) => GetUpdateStreamResponse_UpdateMachine.fromPartial(e)) || []
    message.volumes = object.volumes?.map((e) => GetUpdateStreamResponse_UpdateVolume.fromPartial(e)) || []
    return message
  },
}

function createBaseGetUpdateStreamResponse_UpdateMachine(): GetUpdateStreamResponse_UpdateMachine {
  return {instanceId: '', desiredState: 0}
}

export const GetUpdateStreamResponse_UpdateMachine = {
  encode(message: GetUpdateStreamResponse_UpdateMachine, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.instanceId !== '') {
      writer.uint32(10).string(message.instanceId)
    }
    if (message.desiredState !== 0) {
      writer.uint32(16).int32(message.desiredState)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUpdateStreamResponse_UpdateMachine {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseGetUpdateStreamResponse_UpdateMachine()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.instanceId = reader.string()
          break
        case 2:
          message.desiredState = reader.int32() as any
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): GetUpdateStreamResponse_UpdateMachine {
    return {
      instanceId: isSet(object.instanceId) ? String(object.instanceId) : '',
      desiredState: isSet(object.desiredState) ? getUpdateStreamResponse_MachineStateFromJSON(object.desiredState) : 0,
    }
  },

  toJSON(message: GetUpdateStreamResponse_UpdateMachine): unknown {
    const obj: any = {}
    message.instanceId !== undefined && (obj.instanceId = message.instanceId)
    message.desiredState !== undefined &&
      (obj.desiredState = getUpdateStreamResponse_MachineStateToJSON(message.desiredState))
    return obj
  },

  fromPartial(object: DeepPartial<GetUpdateStreamResponse_UpdateMachine>): GetUpdateStreamResponse_UpdateMachine {
    const message = createBaseGetUpdateStreamResponse_UpdateMachine()
    message.instanceId = object.instanceId ?? ''
    message.desiredState = object.desiredState ?? 0
    return message
  },
}

function createBaseGetUpdateStreamResponse_UpdateVolume(): GetUpdateStreamResponse_UpdateVolume {
  return {volumeId: '', desiredState: 0, attachedTo: undefined, device: undefined}
}

export const GetUpdateStreamResponse_UpdateVolume = {
  encode(message: GetUpdateStreamResponse_UpdateVolume, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.volumeId !== '') {
      writer.uint32(10).string(message.volumeId)
    }
    if (message.desiredState !== 0) {
      writer.uint32(16).int32(message.desiredState)
    }
    if (message.attachedTo !== undefined) {
      writer.uint32(26).string(message.attachedTo)
    }
    if (message.device !== undefined) {
      writer.uint32(34).string(message.device)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUpdateStreamResponse_UpdateVolume {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseGetUpdateStreamResponse_UpdateVolume()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.volumeId = reader.string()
          break
        case 2:
          message.desiredState = reader.int32() as any
          break
        case 3:
          message.attachedTo = reader.string()
          break
        case 4:
          message.device = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): GetUpdateStreamResponse_UpdateVolume {
    return {
      volumeId: isSet(object.volumeId) ? String(object.volumeId) : '',
      desiredState: isSet(object.desiredState) ? getUpdateStreamResponse_VolumeStateFromJSON(object.desiredState) : 0,
      attachedTo: isSet(object.attachedTo) ? String(object.attachedTo) : undefined,
      device: isSet(object.device) ? String(object.device) : undefined,
    }
  },

  toJSON(message: GetUpdateStreamResponse_UpdateVolume): unknown {
    const obj: any = {}
    message.volumeId !== undefined && (obj.volumeId = message.volumeId)
    message.desiredState !== undefined &&
      (obj.desiredState = getUpdateStreamResponse_VolumeStateToJSON(message.desiredState))
    message.attachedTo !== undefined && (obj.attachedTo = message.attachedTo)
    message.device !== undefined && (obj.device = message.device)
    return obj
  },

  fromPartial(object: DeepPartial<GetUpdateStreamResponse_UpdateVolume>): GetUpdateStreamResponse_UpdateVolume {
    const message = createBaseGetUpdateStreamResponse_UpdateVolume()
    message.volumeId = object.volumeId ?? ''
    message.desiredState = object.desiredState ?? 0
    message.attachedTo = object.attachedTo ?? undefined
    message.device = object.device ?? undefined
    return message
  },
}

function createBaseReportCurrentStateRequest(): ReportCurrentStateRequest {
  return {state: undefined}
}

export const ReportCurrentStateRequest = {
  encode(message: ReportCurrentStateRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.state?.$case === 'replace') {
      ReportCurrentStateRequest_CloudState.encode(message.state.replace, writer.uint32(10).fork()).ldelim()
    }
    if (message.state?.$case === 'patch') {
      ReportCurrentStateRequest_CloudStatePatch.encode(message.state.patch, writer.uint32(18).fork()).ldelim()
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReportCurrentStateRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseReportCurrentStateRequest()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.state = {
            $case: 'replace',
            replace: ReportCurrentStateRequest_CloudState.decode(reader, reader.uint32()),
          }
          break
        case 2:
          message.state = {
            $case: 'patch',
            patch: ReportCurrentStateRequest_CloudStatePatch.decode(reader, reader.uint32()),
          }
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): ReportCurrentStateRequest {
    return {
      state: isSet(object.replace)
        ? {$case: 'replace', replace: ReportCurrentStateRequest_CloudState.fromJSON(object.replace)}
        : isSet(object.patch)
        ? {$case: 'patch', patch: ReportCurrentStateRequest_CloudStatePatch.fromJSON(object.patch)}
        : undefined,
    }
  },

  toJSON(message: ReportCurrentStateRequest): unknown {
    const obj: any = {}
    message.state?.$case === 'replace' &&
      (obj.replace = message.state?.replace
        ? ReportCurrentStateRequest_CloudState.toJSON(message.state?.replace)
        : undefined)
    message.state?.$case === 'patch' &&
      (obj.patch = message.state?.patch
        ? ReportCurrentStateRequest_CloudStatePatch.toJSON(message.state?.patch)
        : undefined)
    return obj
  },

  fromPartial(object: DeepPartial<ReportCurrentStateRequest>): ReportCurrentStateRequest {
    const message = createBaseReportCurrentStateRequest()
    if (object.state?.$case === 'replace' && object.state?.replace !== undefined && object.state?.replace !== null) {
      message.state = {
        $case: 'replace',
        replace: ReportCurrentStateRequest_CloudState.fromPartial(object.state.replace),
      }
    }
    if (object.state?.$case === 'patch' && object.state?.patch !== undefined && object.state?.patch !== null) {
      message.state = {
        $case: 'patch',
        patch: ReportCurrentStateRequest_CloudStatePatch.fromPartial(object.state.patch),
      }
    }
    return message
  },
}

function createBaseReportCurrentStateRequest_CloudState(): ReportCurrentStateRequest_CloudState {
  return {state: undefined}
}

export const ReportCurrentStateRequest_CloudState = {
  encode(message: ReportCurrentStateRequest_CloudState, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.state?.$case === 'aws') {
      ReportCurrentStateRequest_CloudState_Aws.encode(message.state.aws, writer.uint32(10).fork()).ldelim()
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReportCurrentStateRequest_CloudState {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseReportCurrentStateRequest_CloudState()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.state = {
            $case: 'aws',
            aws: ReportCurrentStateRequest_CloudState_Aws.decode(reader, reader.uint32()),
          }
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): ReportCurrentStateRequest_CloudState {
    return {
      state: isSet(object.aws)
        ? {$case: 'aws', aws: ReportCurrentStateRequest_CloudState_Aws.fromJSON(object.aws)}
        : undefined,
    }
  },

  toJSON(message: ReportCurrentStateRequest_CloudState): unknown {
    const obj: any = {}
    message.state?.$case === 'aws' &&
      (obj.aws = message.state?.aws ? ReportCurrentStateRequest_CloudState_Aws.toJSON(message.state?.aws) : undefined)
    return obj
  },

  fromPartial(object: DeepPartial<ReportCurrentStateRequest_CloudState>): ReportCurrentStateRequest_CloudState {
    const message = createBaseReportCurrentStateRequest_CloudState()
    if (object.state?.$case === 'aws' && object.state?.aws !== undefined && object.state?.aws !== null) {
      message.state = {$case: 'aws', aws: ReportCurrentStateRequest_CloudState_Aws.fromPartial(object.state.aws)}
    }
    return message
  },
}

function createBaseReportCurrentStateRequest_CloudState_Aws(): ReportCurrentStateRequest_CloudState_Aws {
  return {availabilityZone: '', state: ''}
}

export const ReportCurrentStateRequest_CloudState_Aws = {
  encode(message: ReportCurrentStateRequest_CloudState_Aws, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.availabilityZone !== '') {
      writer.uint32(10).string(message.availabilityZone)
    }
    if (message.state !== '') {
      writer.uint32(18).string(message.state)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReportCurrentStateRequest_CloudState_Aws {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseReportCurrentStateRequest_CloudState_Aws()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.availabilityZone = reader.string()
          break
        case 2:
          message.state = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): ReportCurrentStateRequest_CloudState_Aws {
    return {
      availabilityZone: isSet(object.availabilityZone) ? String(object.availabilityZone) : '',
      state: isSet(object.state) ? String(object.state) : '',
    }
  },

  toJSON(message: ReportCurrentStateRequest_CloudState_Aws): unknown {
    const obj: any = {}
    message.availabilityZone !== undefined && (obj.availabilityZone = message.availabilityZone)
    message.state !== undefined && (obj.state = message.state)
    return obj
  },

  fromPartial(object: DeepPartial<ReportCurrentStateRequest_CloudState_Aws>): ReportCurrentStateRequest_CloudState_Aws {
    const message = createBaseReportCurrentStateRequest_CloudState_Aws()
    message.availabilityZone = object.availabilityZone ?? ''
    message.state = object.state ?? ''
    return message
  },
}

function createBaseReportCurrentStateRequest_CloudStatePatch(): ReportCurrentStateRequest_CloudStatePatch {
  return {etag: '', patch: undefined}
}

export const ReportCurrentStateRequest_CloudStatePatch = {
  encode(message: ReportCurrentStateRequest_CloudStatePatch, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.etag !== '') {
      writer.uint32(10).string(message.etag)
    }
    if (message.patch?.$case === 'aws') {
      ReportCurrentStateRequest_CloudStatePatch_Aws.encode(message.patch.aws, writer.uint32(18).fork()).ldelim()
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReportCurrentStateRequest_CloudStatePatch {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseReportCurrentStateRequest_CloudStatePatch()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.etag = reader.string()
          break
        case 2:
          message.patch = {
            $case: 'aws',
            aws: ReportCurrentStateRequest_CloudStatePatch_Aws.decode(reader, reader.uint32()),
          }
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): ReportCurrentStateRequest_CloudStatePatch {
    return {
      etag: isSet(object.etag) ? String(object.etag) : '',
      patch: isSet(object.aws)
        ? {$case: 'aws', aws: ReportCurrentStateRequest_CloudStatePatch_Aws.fromJSON(object.aws)}
        : undefined,
    }
  },

  toJSON(message: ReportCurrentStateRequest_CloudStatePatch): unknown {
    const obj: any = {}
    message.etag !== undefined && (obj.etag = message.etag)
    message.patch?.$case === 'aws' &&
      (obj.aws = message.patch?.aws
        ? ReportCurrentStateRequest_CloudStatePatch_Aws.toJSON(message.patch?.aws)
        : undefined)
    return obj
  },

  fromPartial(
    object: DeepPartial<ReportCurrentStateRequest_CloudStatePatch>,
  ): ReportCurrentStateRequest_CloudStatePatch {
    const message = createBaseReportCurrentStateRequest_CloudStatePatch()
    message.etag = object.etag ?? ''
    if (object.patch?.$case === 'aws' && object.patch?.aws !== undefined && object.patch?.aws !== null) {
      message.patch = {
        $case: 'aws',
        aws: ReportCurrentStateRequest_CloudStatePatch_Aws.fromPartial(object.patch.aws),
      }
    }
    return message
  },
}

function createBaseReportCurrentStateRequest_CloudStatePatch_Aws(): ReportCurrentStateRequest_CloudStatePatch_Aws {
  return {patch: ''}
}

export const ReportCurrentStateRequest_CloudStatePatch_Aws = {
  encode(message: ReportCurrentStateRequest_CloudStatePatch_Aws, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.patch !== '') {
      writer.uint32(10).string(message.patch)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReportCurrentStateRequest_CloudStatePatch_Aws {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseReportCurrentStateRequest_CloudStatePatch_Aws()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.patch = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): ReportCurrentStateRequest_CloudStatePatch_Aws {
    return {patch: isSet(object.patch) ? String(object.patch) : ''}
  },

  toJSON(message: ReportCurrentStateRequest_CloudStatePatch_Aws): unknown {
    const obj: any = {}
    message.patch !== undefined && (obj.patch = message.patch)
    return obj
  },

  fromPartial(
    object: DeepPartial<ReportCurrentStateRequest_CloudStatePatch_Aws>,
  ): ReportCurrentStateRequest_CloudStatePatch_Aws {
    const message = createBaseReportCurrentStateRequest_CloudStatePatch_Aws()
    message.patch = object.patch ?? ''
    return message
  },
}

function createBaseReportCurrentStateResponse(): ReportCurrentStateResponse {
  return {etag: ''}
}

export const ReportCurrentStateResponse = {
  encode(message: ReportCurrentStateResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.etag !== '') {
      writer.uint32(10).string(message.etag)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReportCurrentStateResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseReportCurrentStateResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.etag = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): ReportCurrentStateResponse {
    return {etag: isSet(object.etag) ? String(object.etag) : ''}
  },

  toJSON(message: ReportCurrentStateResponse): unknown {
    const obj: any = {}
    message.etag !== undefined && (obj.etag = message.etag)
    return obj
  },

  fromPartial(object: DeepPartial<ReportCurrentStateResponse>): ReportCurrentStateResponse {
    const message = createBaseReportCurrentStateResponse()
    message.etag = object.etag ?? ''
    return message
  },
}

function createBaseReportErrorsRequest(): ReportErrorsRequest {
  return {errors: []}
}

export const ReportErrorsRequest = {
  encode(message: ReportErrorsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.errors) {
      writer.uint32(10).string(v!)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReportErrorsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseReportErrorsRequest()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.errors.push(reader.string())
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): ReportErrorsRequest {
    return {errors: Array.isArray(object?.errors) ? object.errors.map((e: any) => String(e)) : []}
  },

  toJSON(message: ReportErrorsRequest): unknown {
    const obj: any = {}
    if (message.errors) {
      obj.errors = message.errors.map((e) => e)
    } else {
      obj.errors = []
    }
    return obj
  },

  fromPartial(object: DeepPartial<ReportErrorsRequest>): ReportErrorsRequest {
    const message = createBaseReportErrorsRequest()
    message.errors = object.errors?.map((e) => e) || []
    return message
  },
}

function createBaseReportErrorsResponse(): ReportErrorsResponse {
  return {}
}

export const ReportErrorsResponse = {
  encode(_: ReportErrorsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReportErrorsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseReportErrorsResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(_: any): ReportErrorsResponse {
    return {}
  },

  toJSON(_: ReportErrorsResponse): unknown {
    const obj: any = {}
    return obj
  },

  fromPartial(_: DeepPartial<ReportErrorsResponse>): ReportErrorsResponse {
    const message = createBaseReportErrorsResponse()
    return message
  },
}

function createBaseReportHealthRequest(): ReportHealthRequest {
  return {}
}

export const ReportHealthRequest = {
  encode(_: ReportHealthRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReportHealthRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseReportHealthRequest()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(_: any): ReportHealthRequest {
    return {}
  },

  toJSON(_: ReportHealthRequest): unknown {
    const obj: any = {}
    return obj
  },

  fromPartial(_: DeepPartial<ReportHealthRequest>): ReportHealthRequest {
    const message = createBaseReportHealthRequest()
    return message
  },
}

function createBaseReportHealthResponse(): ReportHealthResponse {
  return {}
}

export const ReportHealthResponse = {
  encode(_: ReportHealthResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReportHealthResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseReportHealthResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(_: any): ReportHealthResponse {
    return {}
  },

  toJSON(_: ReportHealthResponse): unknown {
    const obj: any = {}
    return obj
  },

  fromPartial(_: DeepPartial<ReportHealthResponse>): ReportHealthResponse {
    const message = createBaseReportHealthResponse()
    return message
  },
}

function createBaseGetActiveAgentVersionRequest(): GetActiveAgentVersionRequest {
  return {}
}

export const GetActiveAgentVersionRequest = {
  encode(_: GetActiveAgentVersionRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetActiveAgentVersionRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseGetActiveAgentVersionRequest()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(_: any): GetActiveAgentVersionRequest {
    return {}
  },

  toJSON(_: GetActiveAgentVersionRequest): unknown {
    const obj: any = {}
    return obj
  },

  fromPartial(_: DeepPartial<GetActiveAgentVersionRequest>): GetActiveAgentVersionRequest {
    const message = createBaseGetActiveAgentVersionRequest()
    return message
  },
}

function createBaseGetActiveAgentVersionResponse(): GetActiveAgentVersionResponse {
  return {newerThan: ''}
}

export const GetActiveAgentVersionResponse = {
  encode(message: GetActiveAgentVersionResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.newerThan !== '') {
      writer.uint32(10).string(message.newerThan)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetActiveAgentVersionResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseGetActiveAgentVersionResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.newerThan = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): GetActiveAgentVersionResponse {
    return {newerThan: isSet(object.newerThan) ? String(object.newerThan) : ''}
  },

  toJSON(message: GetActiveAgentVersionResponse): unknown {
    const obj: any = {}
    message.newerThan !== undefined && (obj.newerThan = message.newerThan)
    return obj
  },

  fromPartial(object: DeepPartial<GetActiveAgentVersionResponse>): GetActiveAgentVersionResponse {
    const message = createBaseGetActiveAgentVersionResponse()
    message.newerThan = object.newerThan ?? ''
    return message
  },
}

export type CloudServiceDefinition = typeof CloudServiceDefinition
export const CloudServiceDefinition = {
  name: 'CloudService',
  fullName: 'depot.cloud.v3.CloudService',
  methods: {
    getCreateStream: {
      name: 'GetCreateStream',
      requestType: GetCreateStreamRequest,
      requestStream: false,
      responseType: GetCreateStreamResponse,
      responseStream: true,
      options: {},
    },
    getUpdateStream: {
      name: 'GetUpdateStream',
      requestType: GetUpdateStreamRequest,
      requestStream: false,
      responseType: GetUpdateStreamResponse,
      responseStream: true,
      options: {},
    },
    reportCurrentState: {
      name: 'ReportCurrentState',
      requestType: ReportCurrentStateRequest,
      requestStream: false,
      responseType: ReportCurrentStateResponse,
      responseStream: false,
      options: {},
    },
    reportErrors: {
      name: 'ReportErrors',
      requestType: ReportErrorsRequest,
      requestStream: false,
      responseType: ReportErrorsResponse,
      responseStream: false,
      options: {},
    },
    reportHealth: {
      name: 'ReportHealth',
      requestType: ReportHealthRequest,
      requestStream: true,
      responseType: ReportHealthResponse,
      responseStream: false,
      options: {},
    },
    getActiveAgentVersion: {
      name: 'GetActiveAgentVersion',
      requestType: GetActiveAgentVersionRequest,
      requestStream: false,
      responseType: GetActiveAgentVersionResponse,
      responseStream: false,
      options: {},
    },
  },
} as const

export interface CloudServiceServiceImplementation<CallContextExt = {}> {
  getCreateStream(
    request: GetCreateStreamRequest,
    context: CallContext & CallContextExt,
  ): ServerStreamingMethodResult<DeepPartial<GetCreateStreamResponse>>
  getUpdateStream(
    request: GetUpdateStreamRequest,
    context: CallContext & CallContextExt,
  ): ServerStreamingMethodResult<DeepPartial<GetUpdateStreamResponse>>
  reportCurrentState(
    request: ReportCurrentStateRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<ReportCurrentStateResponse>>
  reportErrors(
    request: ReportErrorsRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<ReportErrorsResponse>>
  reportHealth(
    request: AsyncIterable<ReportHealthRequest>,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<ReportHealthResponse>>
  getActiveAgentVersion(
    request: GetActiveAgentVersionRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<GetActiveAgentVersionResponse>>
}

export interface CloudServiceClient<CallOptionsExt = {}> {
  getCreateStream(
    request: DeepPartial<GetCreateStreamRequest>,
    options?: CallOptions & CallOptionsExt,
  ): AsyncIterable<GetCreateStreamResponse>
  getUpdateStream(
    request: DeepPartial<GetUpdateStreamRequest>,
    options?: CallOptions & CallOptionsExt,
  ): AsyncIterable<GetUpdateStreamResponse>
  reportCurrentState(
    request: DeepPartial<ReportCurrentStateRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<ReportCurrentStateResponse>
  reportErrors(
    request: DeepPartial<ReportErrorsRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<ReportErrorsResponse>
  reportHealth(
    request: AsyncIterable<DeepPartial<ReportHealthRequest>>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<ReportHealthResponse>
  getActiveAgentVersion(
    request: DeepPartial<GetActiveAgentVersionRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<GetActiveAgentVersionResponse>
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {$case: string}
  ? {[K in keyof Omit<T, '$case'>]?: DeepPartial<T[K]>} & {$case: T['$case']}
  : T extends {}
  ? {[K in keyof T]?: DeepPartial<T[K]>}
  : Partial<T>

function isSet(value: any): boolean {
  return value !== null && value !== undefined
}

export type ServerStreamingMethodResult<Response> = {[Symbol.asyncIterator](): AsyncIterator<Response, void>}
