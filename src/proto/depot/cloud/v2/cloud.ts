/* eslint-disable */
import {CallContext, CallOptions} from 'nice-grpc-common'
import _m0 from 'protobufjs/minimal'

export const protobufPackage = 'depot.cloud.v2'

export interface GetDesiredStateRequest {
  connectionId: string
}

export interface GetDesiredStateResponse {
  newMachines: GetDesiredStateResponse_NewMachine[]
  newVolumes: GetDesiredStateResponse_NewVolume[]
  machineChanges: GetDesiredStateResponse_MachineChange[]
  volumeChanges: GetDesiredStateResponse_VolumeChange[]
}

export enum GetDesiredStateResponse_Architecture {
  ARCHITECTURE_UNSPECIFIED = 0,
  ARCHITECTURE_X86 = 1,
  ARCHITECTURE_ARM = 2,
  UNRECOGNIZED = -1,
}

export function getDesiredStateResponse_ArchitectureFromJSON(object: any): GetDesiredStateResponse_Architecture {
  switch (object) {
    case 0:
    case 'ARCHITECTURE_UNSPECIFIED':
      return GetDesiredStateResponse_Architecture.ARCHITECTURE_UNSPECIFIED
    case 1:
    case 'ARCHITECTURE_X86':
      return GetDesiredStateResponse_Architecture.ARCHITECTURE_X86
    case 2:
    case 'ARCHITECTURE_ARM':
      return GetDesiredStateResponse_Architecture.ARCHITECTURE_ARM
    case -1:
    case 'UNRECOGNIZED':
    default:
      return GetDesiredStateResponse_Architecture.UNRECOGNIZED
  }
}

export function getDesiredStateResponse_ArchitectureToJSON(object: GetDesiredStateResponse_Architecture): string {
  switch (object) {
    case GetDesiredStateResponse_Architecture.ARCHITECTURE_UNSPECIFIED:
      return 'ARCHITECTURE_UNSPECIFIED'
    case GetDesiredStateResponse_Architecture.ARCHITECTURE_X86:
      return 'ARCHITECTURE_X86'
    case GetDesiredStateResponse_Architecture.ARCHITECTURE_ARM:
      return 'ARCHITECTURE_ARM'
    case GetDesiredStateResponse_Architecture.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED'
  }
}

export enum GetDesiredStateResponse_Kind {
  KIND_UNSPECIFIED = 0,
  KIND_BUILDKIT = 1,
  UNRECOGNIZED = -1,
}

export function getDesiredStateResponse_KindFromJSON(object: any): GetDesiredStateResponse_Kind {
  switch (object) {
    case 0:
    case 'KIND_UNSPECIFIED':
      return GetDesiredStateResponse_Kind.KIND_UNSPECIFIED
    case 1:
    case 'KIND_BUILDKIT':
      return GetDesiredStateResponse_Kind.KIND_BUILDKIT
    case -1:
    case 'UNRECOGNIZED':
    default:
      return GetDesiredStateResponse_Kind.UNRECOGNIZED
  }
}

export function getDesiredStateResponse_KindToJSON(object: GetDesiredStateResponse_Kind): string {
  switch (object) {
    case GetDesiredStateResponse_Kind.KIND_UNSPECIFIED:
      return 'KIND_UNSPECIFIED'
    case GetDesiredStateResponse_Kind.KIND_BUILDKIT:
      return 'KIND_BUILDKIT'
    case GetDesiredStateResponse_Kind.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED'
  }
}

export enum GetDesiredStateResponse_MachineState {
  MACHINE_STATE_UNSPECIFIED = 0,
  MACHINE_STATE_PENDING = 1,
  MACHINE_STATE_RUNNING = 2,
  MACHINE_STATE_STOPPING = 3,
  MACHINE_STATE_STOPPED = 4,
  MACHINE_STATE_DELETING = 5,
  MACHINE_STATE_DELETED = 6,
  MACHINE_STATE_ERROR = 7,
  UNRECOGNIZED = -1,
}

export function getDesiredStateResponse_MachineStateFromJSON(object: any): GetDesiredStateResponse_MachineState {
  switch (object) {
    case 0:
    case 'MACHINE_STATE_UNSPECIFIED':
      return GetDesiredStateResponse_MachineState.MACHINE_STATE_UNSPECIFIED
    case 1:
    case 'MACHINE_STATE_PENDING':
      return GetDesiredStateResponse_MachineState.MACHINE_STATE_PENDING
    case 2:
    case 'MACHINE_STATE_RUNNING':
      return GetDesiredStateResponse_MachineState.MACHINE_STATE_RUNNING
    case 3:
    case 'MACHINE_STATE_STOPPING':
      return GetDesiredStateResponse_MachineState.MACHINE_STATE_STOPPING
    case 4:
    case 'MACHINE_STATE_STOPPED':
      return GetDesiredStateResponse_MachineState.MACHINE_STATE_STOPPED
    case 5:
    case 'MACHINE_STATE_DELETING':
      return GetDesiredStateResponse_MachineState.MACHINE_STATE_DELETING
    case 6:
    case 'MACHINE_STATE_DELETED':
      return GetDesiredStateResponse_MachineState.MACHINE_STATE_DELETED
    case 7:
    case 'MACHINE_STATE_ERROR':
      return GetDesiredStateResponse_MachineState.MACHINE_STATE_ERROR
    case -1:
    case 'UNRECOGNIZED':
    default:
      return GetDesiredStateResponse_MachineState.UNRECOGNIZED
  }
}

export function getDesiredStateResponse_MachineStateToJSON(object: GetDesiredStateResponse_MachineState): string {
  switch (object) {
    case GetDesiredStateResponse_MachineState.MACHINE_STATE_UNSPECIFIED:
      return 'MACHINE_STATE_UNSPECIFIED'
    case GetDesiredStateResponse_MachineState.MACHINE_STATE_PENDING:
      return 'MACHINE_STATE_PENDING'
    case GetDesiredStateResponse_MachineState.MACHINE_STATE_RUNNING:
      return 'MACHINE_STATE_RUNNING'
    case GetDesiredStateResponse_MachineState.MACHINE_STATE_STOPPING:
      return 'MACHINE_STATE_STOPPING'
    case GetDesiredStateResponse_MachineState.MACHINE_STATE_STOPPED:
      return 'MACHINE_STATE_STOPPED'
    case GetDesiredStateResponse_MachineState.MACHINE_STATE_DELETING:
      return 'MACHINE_STATE_DELETING'
    case GetDesiredStateResponse_MachineState.MACHINE_STATE_DELETED:
      return 'MACHINE_STATE_DELETED'
    case GetDesiredStateResponse_MachineState.MACHINE_STATE_ERROR:
      return 'MACHINE_STATE_ERROR'
    case GetDesiredStateResponse_MachineState.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED'
  }
}

export enum GetDesiredStateResponse_SecurityGroup {
  SECURITY_GROUP_UNSPECIFIED = 0,
  SECURITY_GROUP_DEFAULT = 1,
  SECURITY_GROUP_BUILDKIT = 2,
  UNRECOGNIZED = -1,
}

export function getDesiredStateResponse_SecurityGroupFromJSON(object: any): GetDesiredStateResponse_SecurityGroup {
  switch (object) {
    case 0:
    case 'SECURITY_GROUP_UNSPECIFIED':
      return GetDesiredStateResponse_SecurityGroup.SECURITY_GROUP_UNSPECIFIED
    case 1:
    case 'SECURITY_GROUP_DEFAULT':
      return GetDesiredStateResponse_SecurityGroup.SECURITY_GROUP_DEFAULT
    case 2:
    case 'SECURITY_GROUP_BUILDKIT':
      return GetDesiredStateResponse_SecurityGroup.SECURITY_GROUP_BUILDKIT
    case -1:
    case 'UNRECOGNIZED':
    default:
      return GetDesiredStateResponse_SecurityGroup.UNRECOGNIZED
  }
}

export function getDesiredStateResponse_SecurityGroupToJSON(object: GetDesiredStateResponse_SecurityGroup): string {
  switch (object) {
    case GetDesiredStateResponse_SecurityGroup.SECURITY_GROUP_UNSPECIFIED:
      return 'SECURITY_GROUP_UNSPECIFIED'
    case GetDesiredStateResponse_SecurityGroup.SECURITY_GROUP_DEFAULT:
      return 'SECURITY_GROUP_DEFAULT'
    case GetDesiredStateResponse_SecurityGroup.SECURITY_GROUP_BUILDKIT:
      return 'SECURITY_GROUP_BUILDKIT'
    case GetDesiredStateResponse_SecurityGroup.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED'
  }
}

export enum GetDesiredStateResponse_VolumeState {
  VOLUME_STATE_UNSPECIFIED = 0,
  VOLUME_STATE_PENDING = 1,
  VOLUME_STATE_AVAILABLE = 2,
  VOLUME_STATE_ATTACHED = 3,
  VOLUME_STATE_DELETED = 4,
  VOLUME_STATE_ERROR = 5,
  UNRECOGNIZED = -1,
}

export function getDesiredStateResponse_VolumeStateFromJSON(object: any): GetDesiredStateResponse_VolumeState {
  switch (object) {
    case 0:
    case 'VOLUME_STATE_UNSPECIFIED':
      return GetDesiredStateResponse_VolumeState.VOLUME_STATE_UNSPECIFIED
    case 1:
    case 'VOLUME_STATE_PENDING':
      return GetDesiredStateResponse_VolumeState.VOLUME_STATE_PENDING
    case 2:
    case 'VOLUME_STATE_AVAILABLE':
      return GetDesiredStateResponse_VolumeState.VOLUME_STATE_AVAILABLE
    case 3:
    case 'VOLUME_STATE_ATTACHED':
      return GetDesiredStateResponse_VolumeState.VOLUME_STATE_ATTACHED
    case 4:
    case 'VOLUME_STATE_DELETED':
      return GetDesiredStateResponse_VolumeState.VOLUME_STATE_DELETED
    case 5:
    case 'VOLUME_STATE_ERROR':
      return GetDesiredStateResponse_VolumeState.VOLUME_STATE_ERROR
    case -1:
    case 'UNRECOGNIZED':
    default:
      return GetDesiredStateResponse_VolumeState.UNRECOGNIZED
  }
}

export function getDesiredStateResponse_VolumeStateToJSON(object: GetDesiredStateResponse_VolumeState): string {
  switch (object) {
    case GetDesiredStateResponse_VolumeState.VOLUME_STATE_UNSPECIFIED:
      return 'VOLUME_STATE_UNSPECIFIED'
    case GetDesiredStateResponse_VolumeState.VOLUME_STATE_PENDING:
      return 'VOLUME_STATE_PENDING'
    case GetDesiredStateResponse_VolumeState.VOLUME_STATE_AVAILABLE:
      return 'VOLUME_STATE_AVAILABLE'
    case GetDesiredStateResponse_VolumeState.VOLUME_STATE_ATTACHED:
      return 'VOLUME_STATE_ATTACHED'
    case GetDesiredStateResponse_VolumeState.VOLUME_STATE_DELETED:
      return 'VOLUME_STATE_DELETED'
    case GetDesiredStateResponse_VolumeState.VOLUME_STATE_ERROR:
      return 'VOLUME_STATE_ERROR'
    case GetDesiredStateResponse_VolumeState.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED'
  }
}

export interface GetDesiredStateResponse_NewMachine {
  id: string
  realm: string
  kind: GetDesiredStateResponse_Kind
  architecture: GetDesiredStateResponse_Architecture
  image: string
  securityGroup: GetDesiredStateResponse_SecurityGroup
}

export interface GetDesiredStateResponse_NewVolume {
  id: string
  realm: string
  kind: GetDesiredStateResponse_Kind
  architecture: GetDesiredStateResponse_Architecture
  size: number
}

export interface GetDesiredStateResponse_MachineChange {
  id: string
  desiredState: GetDesiredStateResponse_MachineState
}

export interface GetDesiredStateResponse_VolumeChange {
  id: string
  desiredState: GetDesiredStateResponse_VolumeState
  attachedTo?: string | undefined
  device?: string | undefined
}

export interface ReportCurrentStateRequest {
  connectionId: string
  state?: {$case: 'replace'; replace: CloudState} | {$case: 'patch'; patch: CloudStatePatch}
}

export interface ReportCurrentStateResponse {
  generation: number
}

export interface ReportErrorsRequest {
  connectionId: string
  errors: string[]
}

export interface ReportErrorsResponse {}

export interface ReportHealthRequest {
  connectionId: string
}

export interface ReportHealthResponse {}

export interface CloudState {
  state?: {$case: 'aws'; aws: CloudState_Aws}
}

export interface CloudState_Aws {
  availabilityZone: string
  state: string
}

export interface CloudStatePatch {
  generation: number
  patch?: {$case: 'aws'; aws: CloudStatePatch_Aws}
}

export interface CloudStatePatch_Aws {
  patch: string
}

function createBaseGetDesiredStateRequest(): GetDesiredStateRequest {
  return {connectionId: ''}
}

export const GetDesiredStateRequest = {
  encode(message: GetDesiredStateRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.connectionId !== '') {
      writer.uint32(10).string(message.connectionId)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetDesiredStateRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseGetDesiredStateRequest()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.connectionId = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): GetDesiredStateRequest {
    return {connectionId: isSet(object.connectionId) ? String(object.connectionId) : ''}
  },

  toJSON(message: GetDesiredStateRequest): unknown {
    const obj: any = {}
    message.connectionId !== undefined && (obj.connectionId = message.connectionId)
    return obj
  },

  fromPartial(object: DeepPartial<GetDesiredStateRequest>): GetDesiredStateRequest {
    const message = createBaseGetDesiredStateRequest()
    message.connectionId = object.connectionId ?? ''
    return message
  },
}

function createBaseGetDesiredStateResponse(): GetDesiredStateResponse {
  return {newMachines: [], newVolumes: [], machineChanges: [], volumeChanges: []}
}

export const GetDesiredStateResponse = {
  encode(message: GetDesiredStateResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.newMachines) {
      GetDesiredStateResponse_NewMachine.encode(v!, writer.uint32(10).fork()).ldelim()
    }
    for (const v of message.newVolumes) {
      GetDesiredStateResponse_NewVolume.encode(v!, writer.uint32(18).fork()).ldelim()
    }
    for (const v of message.machineChanges) {
      GetDesiredStateResponse_MachineChange.encode(v!, writer.uint32(26).fork()).ldelim()
    }
    for (const v of message.volumeChanges) {
      GetDesiredStateResponse_VolumeChange.encode(v!, writer.uint32(34).fork()).ldelim()
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetDesiredStateResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseGetDesiredStateResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.newMachines.push(GetDesiredStateResponse_NewMachine.decode(reader, reader.uint32()))
          break
        case 2:
          message.newVolumes.push(GetDesiredStateResponse_NewVolume.decode(reader, reader.uint32()))
          break
        case 3:
          message.machineChanges.push(GetDesiredStateResponse_MachineChange.decode(reader, reader.uint32()))
          break
        case 4:
          message.volumeChanges.push(GetDesiredStateResponse_VolumeChange.decode(reader, reader.uint32()))
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): GetDesiredStateResponse {
    return {
      newMachines: Array.isArray(object?.newMachines)
        ? object.newMachines.map((e: any) => GetDesiredStateResponse_NewMachine.fromJSON(e))
        : [],
      newVolumes: Array.isArray(object?.newVolumes)
        ? object.newVolumes.map((e: any) => GetDesiredStateResponse_NewVolume.fromJSON(e))
        : [],
      machineChanges: Array.isArray(object?.machineChanges)
        ? object.machineChanges.map((e: any) => GetDesiredStateResponse_MachineChange.fromJSON(e))
        : [],
      volumeChanges: Array.isArray(object?.volumeChanges)
        ? object.volumeChanges.map((e: any) => GetDesiredStateResponse_VolumeChange.fromJSON(e))
        : [],
    }
  },

  toJSON(message: GetDesiredStateResponse): unknown {
    const obj: any = {}
    if (message.newMachines) {
      obj.newMachines = message.newMachines.map((e) => (e ? GetDesiredStateResponse_NewMachine.toJSON(e) : undefined))
    } else {
      obj.newMachines = []
    }
    if (message.newVolumes) {
      obj.newVolumes = message.newVolumes.map((e) => (e ? GetDesiredStateResponse_NewVolume.toJSON(e) : undefined))
    } else {
      obj.newVolumes = []
    }
    if (message.machineChanges) {
      obj.machineChanges = message.machineChanges.map((e) =>
        e ? GetDesiredStateResponse_MachineChange.toJSON(e) : undefined,
      )
    } else {
      obj.machineChanges = []
    }
    if (message.volumeChanges) {
      obj.volumeChanges = message.volumeChanges.map((e) =>
        e ? GetDesiredStateResponse_VolumeChange.toJSON(e) : undefined,
      )
    } else {
      obj.volumeChanges = []
    }
    return obj
  },

  fromPartial(object: DeepPartial<GetDesiredStateResponse>): GetDesiredStateResponse {
    const message = createBaseGetDesiredStateResponse()
    message.newMachines = object.newMachines?.map((e) => GetDesiredStateResponse_NewMachine.fromPartial(e)) || []
    message.newVolumes = object.newVolumes?.map((e) => GetDesiredStateResponse_NewVolume.fromPartial(e)) || []
    message.machineChanges =
      object.machineChanges?.map((e) => GetDesiredStateResponse_MachineChange.fromPartial(e)) || []
    message.volumeChanges = object.volumeChanges?.map((e) => GetDesiredStateResponse_VolumeChange.fromPartial(e)) || []
    return message
  },
}

function createBaseGetDesiredStateResponse_NewMachine(): GetDesiredStateResponse_NewMachine {
  return {id: '', realm: '', kind: 0, architecture: 0, image: '', securityGroup: 0}
}

export const GetDesiredStateResponse_NewMachine = {
  encode(message: GetDesiredStateResponse_NewMachine, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== '') {
      writer.uint32(10).string(message.id)
    }
    if (message.realm !== '') {
      writer.uint32(18).string(message.realm)
    }
    if (message.kind !== 0) {
      writer.uint32(24).int32(message.kind)
    }
    if (message.architecture !== 0) {
      writer.uint32(32).int32(message.architecture)
    }
    if (message.image !== '') {
      writer.uint32(42).string(message.image)
    }
    if (message.securityGroup !== 0) {
      writer.uint32(48).int32(message.securityGroup)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetDesiredStateResponse_NewMachine {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseGetDesiredStateResponse_NewMachine()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string()
          break
        case 2:
          message.realm = reader.string()
          break
        case 3:
          message.kind = reader.int32() as any
          break
        case 4:
          message.architecture = reader.int32() as any
          break
        case 5:
          message.image = reader.string()
          break
        case 6:
          message.securityGroup = reader.int32() as any
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): GetDesiredStateResponse_NewMachine {
    return {
      id: isSet(object.id) ? String(object.id) : '',
      realm: isSet(object.realm) ? String(object.realm) : '',
      kind: isSet(object.kind) ? getDesiredStateResponse_KindFromJSON(object.kind) : 0,
      architecture: isSet(object.architecture) ? getDesiredStateResponse_ArchitectureFromJSON(object.architecture) : 0,
      image: isSet(object.image) ? String(object.image) : '',
      securityGroup: isSet(object.securityGroup)
        ? getDesiredStateResponse_SecurityGroupFromJSON(object.securityGroup)
        : 0,
    }
  },

  toJSON(message: GetDesiredStateResponse_NewMachine): unknown {
    const obj: any = {}
    message.id !== undefined && (obj.id = message.id)
    message.realm !== undefined && (obj.realm = message.realm)
    message.kind !== undefined && (obj.kind = getDesiredStateResponse_KindToJSON(message.kind))
    message.architecture !== undefined &&
      (obj.architecture = getDesiredStateResponse_ArchitectureToJSON(message.architecture))
    message.image !== undefined && (obj.image = message.image)
    message.securityGroup !== undefined &&
      (obj.securityGroup = getDesiredStateResponse_SecurityGroupToJSON(message.securityGroup))
    return obj
  },

  fromPartial(object: DeepPartial<GetDesiredStateResponse_NewMachine>): GetDesiredStateResponse_NewMachine {
    const message = createBaseGetDesiredStateResponse_NewMachine()
    message.id = object.id ?? ''
    message.realm = object.realm ?? ''
    message.kind = object.kind ?? 0
    message.architecture = object.architecture ?? 0
    message.image = object.image ?? ''
    message.securityGroup = object.securityGroup ?? 0
    return message
  },
}

function createBaseGetDesiredStateResponse_NewVolume(): GetDesiredStateResponse_NewVolume {
  return {id: '', realm: '', kind: 0, architecture: 0, size: 0}
}

export const GetDesiredStateResponse_NewVolume = {
  encode(message: GetDesiredStateResponse_NewVolume, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== '') {
      writer.uint32(10).string(message.id)
    }
    if (message.realm !== '') {
      writer.uint32(18).string(message.realm)
    }
    if (message.kind !== 0) {
      writer.uint32(24).int32(message.kind)
    }
    if (message.architecture !== 0) {
      writer.uint32(32).int32(message.architecture)
    }
    if (message.size !== 0) {
      writer.uint32(40).int32(message.size)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetDesiredStateResponse_NewVolume {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseGetDesiredStateResponse_NewVolume()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string()
          break
        case 2:
          message.realm = reader.string()
          break
        case 3:
          message.kind = reader.int32() as any
          break
        case 4:
          message.architecture = reader.int32() as any
          break
        case 5:
          message.size = reader.int32()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): GetDesiredStateResponse_NewVolume {
    return {
      id: isSet(object.id) ? String(object.id) : '',
      realm: isSet(object.realm) ? String(object.realm) : '',
      kind: isSet(object.kind) ? getDesiredStateResponse_KindFromJSON(object.kind) : 0,
      architecture: isSet(object.architecture) ? getDesiredStateResponse_ArchitectureFromJSON(object.architecture) : 0,
      size: isSet(object.size) ? Number(object.size) : 0,
    }
  },

  toJSON(message: GetDesiredStateResponse_NewVolume): unknown {
    const obj: any = {}
    message.id !== undefined && (obj.id = message.id)
    message.realm !== undefined && (obj.realm = message.realm)
    message.kind !== undefined && (obj.kind = getDesiredStateResponse_KindToJSON(message.kind))
    message.architecture !== undefined &&
      (obj.architecture = getDesiredStateResponse_ArchitectureToJSON(message.architecture))
    message.size !== undefined && (obj.size = Math.round(message.size))
    return obj
  },

  fromPartial(object: DeepPartial<GetDesiredStateResponse_NewVolume>): GetDesiredStateResponse_NewVolume {
    const message = createBaseGetDesiredStateResponse_NewVolume()
    message.id = object.id ?? ''
    message.realm = object.realm ?? ''
    message.kind = object.kind ?? 0
    message.architecture = object.architecture ?? 0
    message.size = object.size ?? 0
    return message
  },
}

function createBaseGetDesiredStateResponse_MachineChange(): GetDesiredStateResponse_MachineChange {
  return {id: '', desiredState: 0}
}

export const GetDesiredStateResponse_MachineChange = {
  encode(message: GetDesiredStateResponse_MachineChange, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== '') {
      writer.uint32(10).string(message.id)
    }
    if (message.desiredState !== 0) {
      writer.uint32(16).int32(message.desiredState)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetDesiredStateResponse_MachineChange {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseGetDesiredStateResponse_MachineChange()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string()
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

  fromJSON(object: any): GetDesiredStateResponse_MachineChange {
    return {
      id: isSet(object.id) ? String(object.id) : '',
      desiredState: isSet(object.desiredState) ? getDesiredStateResponse_MachineStateFromJSON(object.desiredState) : 0,
    }
  },

  toJSON(message: GetDesiredStateResponse_MachineChange): unknown {
    const obj: any = {}
    message.id !== undefined && (obj.id = message.id)
    message.desiredState !== undefined &&
      (obj.desiredState = getDesiredStateResponse_MachineStateToJSON(message.desiredState))
    return obj
  },

  fromPartial(object: DeepPartial<GetDesiredStateResponse_MachineChange>): GetDesiredStateResponse_MachineChange {
    const message = createBaseGetDesiredStateResponse_MachineChange()
    message.id = object.id ?? ''
    message.desiredState = object.desiredState ?? 0
    return message
  },
}

function createBaseGetDesiredStateResponse_VolumeChange(): GetDesiredStateResponse_VolumeChange {
  return {id: '', desiredState: 0, attachedTo: undefined, device: undefined}
}

export const GetDesiredStateResponse_VolumeChange = {
  encode(message: GetDesiredStateResponse_VolumeChange, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== '') {
      writer.uint32(10).string(message.id)
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

  decode(input: _m0.Reader | Uint8Array, length?: number): GetDesiredStateResponse_VolumeChange {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseGetDesiredStateResponse_VolumeChange()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string()
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

  fromJSON(object: any): GetDesiredStateResponse_VolumeChange {
    return {
      id: isSet(object.id) ? String(object.id) : '',
      desiredState: isSet(object.desiredState) ? getDesiredStateResponse_VolumeStateFromJSON(object.desiredState) : 0,
      attachedTo: isSet(object.attachedTo) ? String(object.attachedTo) : undefined,
      device: isSet(object.device) ? String(object.device) : undefined,
    }
  },

  toJSON(message: GetDesiredStateResponse_VolumeChange): unknown {
    const obj: any = {}
    message.id !== undefined && (obj.id = message.id)
    message.desiredState !== undefined &&
      (obj.desiredState = getDesiredStateResponse_VolumeStateToJSON(message.desiredState))
    message.attachedTo !== undefined && (obj.attachedTo = message.attachedTo)
    message.device !== undefined && (obj.device = message.device)
    return obj
  },

  fromPartial(object: DeepPartial<GetDesiredStateResponse_VolumeChange>): GetDesiredStateResponse_VolumeChange {
    const message = createBaseGetDesiredStateResponse_VolumeChange()
    message.id = object.id ?? ''
    message.desiredState = object.desiredState ?? 0
    message.attachedTo = object.attachedTo ?? undefined
    message.device = object.device ?? undefined
    return message
  },
}

function createBaseReportCurrentStateRequest(): ReportCurrentStateRequest {
  return {connectionId: '', state: undefined}
}

export const ReportCurrentStateRequest = {
  encode(message: ReportCurrentStateRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.connectionId !== '') {
      writer.uint32(10).string(message.connectionId)
    }
    if (message.state?.$case === 'replace') {
      CloudState.encode(message.state.replace, writer.uint32(18).fork()).ldelim()
    }
    if (message.state?.$case === 'patch') {
      CloudStatePatch.encode(message.state.patch, writer.uint32(26).fork()).ldelim()
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
          message.connectionId = reader.string()
          break
        case 2:
          message.state = {$case: 'replace', replace: CloudState.decode(reader, reader.uint32())}
          break
        case 3:
          message.state = {$case: 'patch', patch: CloudStatePatch.decode(reader, reader.uint32())}
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
      connectionId: isSet(object.connectionId) ? String(object.connectionId) : '',
      state: isSet(object.replace)
        ? {$case: 'replace', replace: CloudState.fromJSON(object.replace)}
        : isSet(object.patch)
        ? {$case: 'patch', patch: CloudStatePatch.fromJSON(object.patch)}
        : undefined,
    }
  },

  toJSON(message: ReportCurrentStateRequest): unknown {
    const obj: any = {}
    message.connectionId !== undefined && (obj.connectionId = message.connectionId)
    message.state?.$case === 'replace' &&
      (obj.replace = message.state?.replace ? CloudState.toJSON(message.state?.replace) : undefined)
    message.state?.$case === 'patch' &&
      (obj.patch = message.state?.patch ? CloudStatePatch.toJSON(message.state?.patch) : undefined)
    return obj
  },

  fromPartial(object: DeepPartial<ReportCurrentStateRequest>): ReportCurrentStateRequest {
    const message = createBaseReportCurrentStateRequest()
    message.connectionId = object.connectionId ?? ''
    if (object.state?.$case === 'replace' && object.state?.replace !== undefined && object.state?.replace !== null) {
      message.state = {$case: 'replace', replace: CloudState.fromPartial(object.state.replace)}
    }
    if (object.state?.$case === 'patch' && object.state?.patch !== undefined && object.state?.patch !== null) {
      message.state = {$case: 'patch', patch: CloudStatePatch.fromPartial(object.state.patch)}
    }
    return message
  },
}

function createBaseReportCurrentStateResponse(): ReportCurrentStateResponse {
  return {generation: 0}
}

export const ReportCurrentStateResponse = {
  encode(message: ReportCurrentStateResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.generation !== 0) {
      writer.uint32(8).int32(message.generation)
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
          message.generation = reader.int32()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): ReportCurrentStateResponse {
    return {generation: isSet(object.generation) ? Number(object.generation) : 0}
  },

  toJSON(message: ReportCurrentStateResponse): unknown {
    const obj: any = {}
    message.generation !== undefined && (obj.generation = Math.round(message.generation))
    return obj
  },

  fromPartial(object: DeepPartial<ReportCurrentStateResponse>): ReportCurrentStateResponse {
    const message = createBaseReportCurrentStateResponse()
    message.generation = object.generation ?? 0
    return message
  },
}

function createBaseReportErrorsRequest(): ReportErrorsRequest {
  return {connectionId: '', errors: []}
}

export const ReportErrorsRequest = {
  encode(message: ReportErrorsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.connectionId !== '') {
      writer.uint32(10).string(message.connectionId)
    }
    for (const v of message.errors) {
      writer.uint32(18).string(v!)
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
          message.connectionId = reader.string()
          break
        case 2:
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
    return {
      connectionId: isSet(object.connectionId) ? String(object.connectionId) : '',
      errors: Array.isArray(object?.errors) ? object.errors.map((e: any) => String(e)) : [],
    }
  },

  toJSON(message: ReportErrorsRequest): unknown {
    const obj: any = {}
    message.connectionId !== undefined && (obj.connectionId = message.connectionId)
    if (message.errors) {
      obj.errors = message.errors.map((e) => e)
    } else {
      obj.errors = []
    }
    return obj
  },

  fromPartial(object: DeepPartial<ReportErrorsRequest>): ReportErrorsRequest {
    const message = createBaseReportErrorsRequest()
    message.connectionId = object.connectionId ?? ''
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
  return {connectionId: ''}
}

export const ReportHealthRequest = {
  encode(message: ReportHealthRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.connectionId !== '') {
      writer.uint32(10).string(message.connectionId)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReportHealthRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseReportHealthRequest()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.connectionId = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): ReportHealthRequest {
    return {connectionId: isSet(object.connectionId) ? String(object.connectionId) : ''}
  },

  toJSON(message: ReportHealthRequest): unknown {
    const obj: any = {}
    message.connectionId !== undefined && (obj.connectionId = message.connectionId)
    return obj
  },

  fromPartial(object: DeepPartial<ReportHealthRequest>): ReportHealthRequest {
    const message = createBaseReportHealthRequest()
    message.connectionId = object.connectionId ?? ''
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

function createBaseCloudState(): CloudState {
  return {state: undefined}
}

export const CloudState = {
  encode(message: CloudState, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.state?.$case === 'aws') {
      CloudState_Aws.encode(message.state.aws, writer.uint32(10).fork()).ldelim()
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CloudState {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseCloudState()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.state = {$case: 'aws', aws: CloudState_Aws.decode(reader, reader.uint32())}
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): CloudState {
    return {state: isSet(object.aws) ? {$case: 'aws', aws: CloudState_Aws.fromJSON(object.aws)} : undefined}
  },

  toJSON(message: CloudState): unknown {
    const obj: any = {}
    message.state?.$case === 'aws' &&
      (obj.aws = message.state?.aws ? CloudState_Aws.toJSON(message.state?.aws) : undefined)
    return obj
  },

  fromPartial(object: DeepPartial<CloudState>): CloudState {
    const message = createBaseCloudState()
    if (object.state?.$case === 'aws' && object.state?.aws !== undefined && object.state?.aws !== null) {
      message.state = {$case: 'aws', aws: CloudState_Aws.fromPartial(object.state.aws)}
    }
    return message
  },
}

function createBaseCloudState_Aws(): CloudState_Aws {
  return {availabilityZone: '', state: ''}
}

export const CloudState_Aws = {
  encode(message: CloudState_Aws, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.availabilityZone !== '') {
      writer.uint32(10).string(message.availabilityZone)
    }
    if (message.state !== '') {
      writer.uint32(18).string(message.state)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CloudState_Aws {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseCloudState_Aws()
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

  fromJSON(object: any): CloudState_Aws {
    return {
      availabilityZone: isSet(object.availabilityZone) ? String(object.availabilityZone) : '',
      state: isSet(object.state) ? String(object.state) : '',
    }
  },

  toJSON(message: CloudState_Aws): unknown {
    const obj: any = {}
    message.availabilityZone !== undefined && (obj.availabilityZone = message.availabilityZone)
    message.state !== undefined && (obj.state = message.state)
    return obj
  },

  fromPartial(object: DeepPartial<CloudState_Aws>): CloudState_Aws {
    const message = createBaseCloudState_Aws()
    message.availabilityZone = object.availabilityZone ?? ''
    message.state = object.state ?? ''
    return message
  },
}

function createBaseCloudStatePatch(): CloudStatePatch {
  return {generation: 0, patch: undefined}
}

export const CloudStatePatch = {
  encode(message: CloudStatePatch, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.generation !== 0) {
      writer.uint32(8).int32(message.generation)
    }
    if (message.patch?.$case === 'aws') {
      CloudStatePatch_Aws.encode(message.patch.aws, writer.uint32(18).fork()).ldelim()
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CloudStatePatch {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseCloudStatePatch()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.generation = reader.int32()
          break
        case 2:
          message.patch = {$case: 'aws', aws: CloudStatePatch_Aws.decode(reader, reader.uint32())}
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): CloudStatePatch {
    return {
      generation: isSet(object.generation) ? Number(object.generation) : 0,
      patch: isSet(object.aws) ? {$case: 'aws', aws: CloudStatePatch_Aws.fromJSON(object.aws)} : undefined,
    }
  },

  toJSON(message: CloudStatePatch): unknown {
    const obj: any = {}
    message.generation !== undefined && (obj.generation = Math.round(message.generation))
    message.patch?.$case === 'aws' &&
      (obj.aws = message.patch?.aws ? CloudStatePatch_Aws.toJSON(message.patch?.aws) : undefined)
    return obj
  },

  fromPartial(object: DeepPartial<CloudStatePatch>): CloudStatePatch {
    const message = createBaseCloudStatePatch()
    message.generation = object.generation ?? 0
    if (object.patch?.$case === 'aws' && object.patch?.aws !== undefined && object.patch?.aws !== null) {
      message.patch = {$case: 'aws', aws: CloudStatePatch_Aws.fromPartial(object.patch.aws)}
    }
    return message
  },
}

function createBaseCloudStatePatch_Aws(): CloudStatePatch_Aws {
  return {patch: ''}
}

export const CloudStatePatch_Aws = {
  encode(message: CloudStatePatch_Aws, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.patch !== '') {
      writer.uint32(10).string(message.patch)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CloudStatePatch_Aws {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseCloudStatePatch_Aws()
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

  fromJSON(object: any): CloudStatePatch_Aws {
    return {patch: isSet(object.patch) ? String(object.patch) : ''}
  },

  toJSON(message: CloudStatePatch_Aws): unknown {
    const obj: any = {}
    message.patch !== undefined && (obj.patch = message.patch)
    return obj
  },

  fromPartial(object: DeepPartial<CloudStatePatch_Aws>): CloudStatePatch_Aws {
    const message = createBaseCloudStatePatch_Aws()
    message.patch = object.patch ?? ''
    return message
  },
}

export type CloudServiceDefinition = typeof CloudServiceDefinition
export const CloudServiceDefinition = {
  name: 'CloudService',
  fullName: 'depot.cloud.v2.CloudService',
  methods: {
    getDesiredState: {
      name: 'GetDesiredState',
      requestType: GetDesiredStateRequest,
      requestStream: false,
      responseType: GetDesiredStateResponse,
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
  },
} as const

export interface CloudServiceServiceImplementation<CallContextExt = {}> {
  getDesiredState(
    request: GetDesiredStateRequest,
    context: CallContext & CallContextExt,
  ): ServerStreamingMethodResult<DeepPartial<GetDesiredStateResponse>>
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
}

export interface CloudServiceClient<CallOptionsExt = {}> {
  getDesiredState(
    request: DeepPartial<GetDesiredStateRequest>,
    options?: CallOptions & CallOptionsExt,
  ): AsyncIterable<GetDesiredStateResponse>
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
