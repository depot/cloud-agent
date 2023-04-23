/* eslint-disable */
import type {CallContext, CallOptions} from 'nice-grpc-common'
import _m0 from 'protobufjs/minimal'

export const protobufPackage = 'depot.cloud.v3'

export enum Architecture {
  ARCHITECTURE_UNSPECIFIED = 0,
  ARCHITECTURE_X86 = 1,
  ARCHITECTURE_ARM = 2,
  UNRECOGNIZED = -1,
}

export function architectureFromJSON(object: any): Architecture {
  switch (object) {
    case 0:
    case 'ARCHITECTURE_UNSPECIFIED':
      return Architecture.ARCHITECTURE_UNSPECIFIED
    case 1:
    case 'ARCHITECTURE_X86':
      return Architecture.ARCHITECTURE_X86
    case 2:
    case 'ARCHITECTURE_ARM':
      return Architecture.ARCHITECTURE_ARM
    case -1:
    case 'UNRECOGNIZED':
    default:
      return Architecture.UNRECOGNIZED
  }
}

export function architectureToJSON(object: Architecture): string {
  switch (object) {
    case Architecture.ARCHITECTURE_UNSPECIFIED:
      return 'ARCHITECTURE_UNSPECIFIED'
    case Architecture.ARCHITECTURE_X86:
      return 'ARCHITECTURE_X86'
    case Architecture.ARCHITECTURE_ARM:
      return 'ARCHITECTURE_ARM'
    case Architecture.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED'
  }
}

export enum MachineState {
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

export function machineStateFromJSON(object: any): MachineState {
  switch (object) {
    case 0:
    case 'MACHINE_STATE_UNSPECIFIED':
      return MachineState.MACHINE_STATE_UNSPECIFIED
    case 1:
    case 'MACHINE_STATE_PENDING':
      return MachineState.MACHINE_STATE_PENDING
    case 2:
    case 'MACHINE_STATE_RUNNING':
      return MachineState.MACHINE_STATE_RUNNING
    case 3:
    case 'MACHINE_STATE_STOPPING':
      return MachineState.MACHINE_STATE_STOPPING
    case 4:
    case 'MACHINE_STATE_STOPPED':
      return MachineState.MACHINE_STATE_STOPPED
    case 5:
    case 'MACHINE_STATE_DELETING':
      return MachineState.MACHINE_STATE_DELETING
    case 6:
    case 'MACHINE_STATE_DELETED':
      return MachineState.MACHINE_STATE_DELETED
    case 7:
    case 'MACHINE_STATE_ERROR':
      return MachineState.MACHINE_STATE_ERROR
    case -1:
    case 'UNRECOGNIZED':
    default:
      return MachineState.UNRECOGNIZED
  }
}

export function machineStateToJSON(object: MachineState): string {
  switch (object) {
    case MachineState.MACHINE_STATE_UNSPECIFIED:
      return 'MACHINE_STATE_UNSPECIFIED'
    case MachineState.MACHINE_STATE_PENDING:
      return 'MACHINE_STATE_PENDING'
    case MachineState.MACHINE_STATE_RUNNING:
      return 'MACHINE_STATE_RUNNING'
    case MachineState.MACHINE_STATE_STOPPING:
      return 'MACHINE_STATE_STOPPING'
    case MachineState.MACHINE_STATE_STOPPED:
      return 'MACHINE_STATE_STOPPED'
    case MachineState.MACHINE_STATE_DELETING:
      return 'MACHINE_STATE_DELETING'
    case MachineState.MACHINE_STATE_DELETED:
      return 'MACHINE_STATE_DELETED'
    case MachineState.MACHINE_STATE_ERROR:
      return 'MACHINE_STATE_ERROR'
    case MachineState.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED'
  }
}

export enum SecurityGroup {
  SECURITY_GROUP_UNSPECIFIED = 0,
  SECURITY_GROUP_DEFAULT = 1,
  SECURITY_GROUP_BUILDKIT = 2,
  UNRECOGNIZED = -1,
}

export function securityGroupFromJSON(object: any): SecurityGroup {
  switch (object) {
    case 0:
    case 'SECURITY_GROUP_UNSPECIFIED':
      return SecurityGroup.SECURITY_GROUP_UNSPECIFIED
    case 1:
    case 'SECURITY_GROUP_DEFAULT':
      return SecurityGroup.SECURITY_GROUP_DEFAULT
    case 2:
    case 'SECURITY_GROUP_BUILDKIT':
      return SecurityGroup.SECURITY_GROUP_BUILDKIT
    case -1:
    case 'UNRECOGNIZED':
    default:
      return SecurityGroup.UNRECOGNIZED
  }
}

export function securityGroupToJSON(object: SecurityGroup): string {
  switch (object) {
    case SecurityGroup.SECURITY_GROUP_UNSPECIFIED:
      return 'SECURITY_GROUP_UNSPECIFIED'
    case SecurityGroup.SECURITY_GROUP_DEFAULT:
      return 'SECURITY_GROUP_DEFAULT'
    case SecurityGroup.SECURITY_GROUP_BUILDKIT:
      return 'SECURITY_GROUP_BUILDKIT'
    case SecurityGroup.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED'
  }
}

export enum VolumeState {
  VOLUME_STATE_UNSPECIFIED = 0,
  VOLUME_STATE_PENDING = 1,
  VOLUME_STATE_AVAILABLE = 2,
  VOLUME_STATE_ATTACHED = 3,
  VOLUME_STATE_DELETED = 4,
  VOLUME_STATE_ERROR = 5,
  UNRECOGNIZED = -1,
}

export function volumeStateFromJSON(object: any): VolumeState {
  switch (object) {
    case 0:
    case 'VOLUME_STATE_UNSPECIFIED':
      return VolumeState.VOLUME_STATE_UNSPECIFIED
    case 1:
    case 'VOLUME_STATE_PENDING':
      return VolumeState.VOLUME_STATE_PENDING
    case 2:
    case 'VOLUME_STATE_AVAILABLE':
      return VolumeState.VOLUME_STATE_AVAILABLE
    case 3:
    case 'VOLUME_STATE_ATTACHED':
      return VolumeState.VOLUME_STATE_ATTACHED
    case 4:
    case 'VOLUME_STATE_DELETED':
      return VolumeState.VOLUME_STATE_DELETED
    case 5:
    case 'VOLUME_STATE_ERROR':
      return VolumeState.VOLUME_STATE_ERROR
    case -1:
    case 'UNRECOGNIZED':
    default:
      return VolumeState.UNRECOGNIZED
  }
}

export function volumeStateToJSON(object: VolumeState): string {
  switch (object) {
    case VolumeState.VOLUME_STATE_UNSPECIFIED:
      return 'VOLUME_STATE_UNSPECIFIED'
    case VolumeState.VOLUME_STATE_PENDING:
      return 'VOLUME_STATE_PENDING'
    case VolumeState.VOLUME_STATE_AVAILABLE:
      return 'VOLUME_STATE_AVAILABLE'
    case VolumeState.VOLUME_STATE_ATTACHED:
      return 'VOLUME_STATE_ATTACHED'
    case VolumeState.VOLUME_STATE_DELETED:
      return 'VOLUME_STATE_DELETED'
    case VolumeState.VOLUME_STATE_ERROR:
      return 'VOLUME_STATE_ERROR'
    case VolumeState.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED'
  }
}

export interface SubscribeRequest {
  message?:
    | {$case: 'start'; start: SubscribeRequest_StartMessage}
    | {
        $case: 'success'
        success: SubscribeRequest_SuccessResult
      }
    | {$case: 'error'; error: SubscribeRequest_ErrorResult}
}

export interface SubscribeRequest_StartMessage {}

export interface SubscribeRequest_SuccessResult {
  messageId: string
}

export interface SubscribeRequest_ErrorResult {
  messageId: string
  message: string
}

export interface SubscribeResponse {
  messageId: string
  attributes: {[key: string]: string}
  action: Action | undefined
}

export interface SubscribeResponse_AttributesEntry {
  key: string
  value: string
}

export interface Action {
  kind?:
    | {$case: 'createMachine'; createMachine: Action_CreateMachine}
    | {$case: 'createVolume'; createVolume: Action_CreateVolume}
    | {$case: 'updateMachine'; updateMachine: Action_UpdateMachine}
    | {$case: 'updateVolume'; updateVolume: Action_UpdateVolume}
}

export interface Action_CreateMachine {
  machineId: string
  architecture: Architecture
  image: string
  securityGroup: SecurityGroup
}

export interface Action_CreateVolume {
  volumeId: string
  orgId: string
  projectId: string
  size: number
}

export interface Action_UpdateMachine {
  machineId: string
  desiredState: MachineState
}

export interface Action_UpdateVolume {
  volumeId: string
  desiredState: VolumeState
  attachment?: Action_UpdateVolume_Attachment | undefined
}

export interface Action_UpdateVolume_Attachment {
  machineResourceId: string
  device: string
}

export interface GetMachineEtagsRequest {}

export interface GetMachineEtagsResponse {
  etags: {[key: string]: string}
}

export interface GetMachineEtagsResponse_EtagsEntry {
  key: string
  value: string
}

export interface GetVolumeEtagsRequest {}

export interface GetVolumeEtagsResponse {
  etags: {[key: string]: string}
}

export interface GetVolumeEtagsResponse_EtagsEntry {
  key: string
  value: string
}

export interface ReportMachineStateRequest {
  machineId: string
  etag: string
  state: string
}

export interface ReportMachineStateResponse {}

export interface ReportVolumeStateRequest {
  volumeId: string
  etag: string
  state: string
}

export interface ReportVolumeStateResponse {}

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

function createBaseSubscribeRequest(): SubscribeRequest {
  return {message: undefined}
}

export const SubscribeRequest = {
  encode(message: SubscribeRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.message?.$case === 'start') {
      SubscribeRequest_StartMessage.encode(message.message.start, writer.uint32(10).fork()).ldelim()
    }
    if (message.message?.$case === 'success') {
      SubscribeRequest_SuccessResult.encode(message.message.success, writer.uint32(18).fork()).ldelim()
    }
    if (message.message?.$case === 'error') {
      SubscribeRequest_ErrorResult.encode(message.message.error, writer.uint32(26).fork()).ldelim()
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SubscribeRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseSubscribeRequest()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.message = {$case: 'start', start: SubscribeRequest_StartMessage.decode(reader, reader.uint32())}
          break
        case 2:
          message.message = {
            $case: 'success',
            success: SubscribeRequest_SuccessResult.decode(reader, reader.uint32()),
          }
          break
        case 3:
          message.message = {$case: 'error', error: SubscribeRequest_ErrorResult.decode(reader, reader.uint32())}
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): SubscribeRequest {
    return {
      message: isSet(object.start)
        ? {$case: 'start', start: SubscribeRequest_StartMessage.fromJSON(object.start)}
        : isSet(object.success)
        ? {$case: 'success', success: SubscribeRequest_SuccessResult.fromJSON(object.success)}
        : isSet(object.error)
        ? {$case: 'error', error: SubscribeRequest_ErrorResult.fromJSON(object.error)}
        : undefined,
    }
  },

  toJSON(message: SubscribeRequest): unknown {
    const obj: any = {}
    message.message?.$case === 'start' &&
      (obj.start = message.message?.start ? SubscribeRequest_StartMessage.toJSON(message.message?.start) : undefined)
    message.message?.$case === 'success' &&
      (obj.success = message.message?.success
        ? SubscribeRequest_SuccessResult.toJSON(message.message?.success)
        : undefined)
    message.message?.$case === 'error' &&
      (obj.error = message.message?.error ? SubscribeRequest_ErrorResult.toJSON(message.message?.error) : undefined)
    return obj
  },

  fromPartial(object: DeepPartial<SubscribeRequest>): SubscribeRequest {
    const message = createBaseSubscribeRequest()
    if (object.message?.$case === 'start' && object.message?.start !== undefined && object.message?.start !== null) {
      message.message = {$case: 'start', start: SubscribeRequest_StartMessage.fromPartial(object.message.start)}
    }
    if (
      object.message?.$case === 'success' &&
      object.message?.success !== undefined &&
      object.message?.success !== null
    ) {
      message.message = {
        $case: 'success',
        success: SubscribeRequest_SuccessResult.fromPartial(object.message.success),
      }
    }
    if (object.message?.$case === 'error' && object.message?.error !== undefined && object.message?.error !== null) {
      message.message = {$case: 'error', error: SubscribeRequest_ErrorResult.fromPartial(object.message.error)}
    }
    return message
  },
}

function createBaseSubscribeRequest_StartMessage(): SubscribeRequest_StartMessage {
  return {}
}

export const SubscribeRequest_StartMessage = {
  encode(_: SubscribeRequest_StartMessage, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SubscribeRequest_StartMessage {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseSubscribeRequest_StartMessage()
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

  fromJSON(_: any): SubscribeRequest_StartMessage {
    return {}
  },

  toJSON(_: SubscribeRequest_StartMessage): unknown {
    const obj: any = {}
    return obj
  },

  fromPartial(_: DeepPartial<SubscribeRequest_StartMessage>): SubscribeRequest_StartMessage {
    const message = createBaseSubscribeRequest_StartMessage()
    return message
  },
}

function createBaseSubscribeRequest_SuccessResult(): SubscribeRequest_SuccessResult {
  return {messageId: ''}
}

export const SubscribeRequest_SuccessResult = {
  encode(message: SubscribeRequest_SuccessResult, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.messageId !== '') {
      writer.uint32(10).string(message.messageId)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SubscribeRequest_SuccessResult {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseSubscribeRequest_SuccessResult()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.messageId = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): SubscribeRequest_SuccessResult {
    return {messageId: isSet(object.messageId) ? String(object.messageId) : ''}
  },

  toJSON(message: SubscribeRequest_SuccessResult): unknown {
    const obj: any = {}
    message.messageId !== undefined && (obj.messageId = message.messageId)
    return obj
  },

  fromPartial(object: DeepPartial<SubscribeRequest_SuccessResult>): SubscribeRequest_SuccessResult {
    const message = createBaseSubscribeRequest_SuccessResult()
    message.messageId = object.messageId ?? ''
    return message
  },
}

function createBaseSubscribeRequest_ErrorResult(): SubscribeRequest_ErrorResult {
  return {messageId: '', message: ''}
}

export const SubscribeRequest_ErrorResult = {
  encode(message: SubscribeRequest_ErrorResult, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.messageId !== '') {
      writer.uint32(10).string(message.messageId)
    }
    if (message.message !== '') {
      writer.uint32(18).string(message.message)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SubscribeRequest_ErrorResult {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseSubscribeRequest_ErrorResult()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.messageId = reader.string()
          break
        case 2:
          message.message = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): SubscribeRequest_ErrorResult {
    return {
      messageId: isSet(object.messageId) ? String(object.messageId) : '',
      message: isSet(object.message) ? String(object.message) : '',
    }
  },

  toJSON(message: SubscribeRequest_ErrorResult): unknown {
    const obj: any = {}
    message.messageId !== undefined && (obj.messageId = message.messageId)
    message.message !== undefined && (obj.message = message.message)
    return obj
  },

  fromPartial(object: DeepPartial<SubscribeRequest_ErrorResult>): SubscribeRequest_ErrorResult {
    const message = createBaseSubscribeRequest_ErrorResult()
    message.messageId = object.messageId ?? ''
    message.message = object.message ?? ''
    return message
  },
}

function createBaseSubscribeResponse(): SubscribeResponse {
  return {messageId: '', attributes: {}, action: undefined}
}

export const SubscribeResponse = {
  encode(message: SubscribeResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.messageId !== '') {
      writer.uint32(10).string(message.messageId)
    }
    Object.entries(message.attributes).forEach(([key, value]) => {
      SubscribeResponse_AttributesEntry.encode({key: key as any, value}, writer.uint32(18).fork()).ldelim()
    })
    if (message.action !== undefined) {
      Action.encode(message.action, writer.uint32(26).fork()).ldelim()
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SubscribeResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseSubscribeResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.messageId = reader.string()
          break
        case 2:
          const entry2 = SubscribeResponse_AttributesEntry.decode(reader, reader.uint32())
          if (entry2.value !== undefined) {
            message.attributes[entry2.key] = entry2.value
          }
          break
        case 3:
          message.action = Action.decode(reader, reader.uint32())
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): SubscribeResponse {
    return {
      messageId: isSet(object.messageId) ? String(object.messageId) : '',
      attributes: isObject(object.attributes)
        ? Object.entries(object.attributes).reduce<{[key: string]: string}>((acc, [key, value]) => {
            acc[key] = String(value)
            return acc
          }, {})
        : {},
      action: isSet(object.action) ? Action.fromJSON(object.action) : undefined,
    }
  },

  toJSON(message: SubscribeResponse): unknown {
    const obj: any = {}
    message.messageId !== undefined && (obj.messageId = message.messageId)
    obj.attributes = {}
    if (message.attributes) {
      Object.entries(message.attributes).forEach(([k, v]) => {
        obj.attributes[k] = v
      })
    }
    message.action !== undefined && (obj.action = message.action ? Action.toJSON(message.action) : undefined)
    return obj
  },

  fromPartial(object: DeepPartial<SubscribeResponse>): SubscribeResponse {
    const message = createBaseSubscribeResponse()
    message.messageId = object.messageId ?? ''
    message.attributes = Object.entries(object.attributes ?? {}).reduce<{[key: string]: string}>(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = String(value)
        }
        return acc
      },
      {},
    )
    message.action =
      object.action !== undefined && object.action !== null ? Action.fromPartial(object.action) : undefined
    return message
  },
}

function createBaseSubscribeResponse_AttributesEntry(): SubscribeResponse_AttributesEntry {
  return {key: '', value: ''}
}

export const SubscribeResponse_AttributesEntry = {
  encode(message: SubscribeResponse_AttributesEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== '') {
      writer.uint32(10).string(message.key)
    }
    if (message.value !== '') {
      writer.uint32(18).string(message.value)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SubscribeResponse_AttributesEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseSubscribeResponse_AttributesEntry()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string()
          break
        case 2:
          message.value = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): SubscribeResponse_AttributesEntry {
    return {key: isSet(object.key) ? String(object.key) : '', value: isSet(object.value) ? String(object.value) : ''}
  },

  toJSON(message: SubscribeResponse_AttributesEntry): unknown {
    const obj: any = {}
    message.key !== undefined && (obj.key = message.key)
    message.value !== undefined && (obj.value = message.value)
    return obj
  },

  fromPartial(object: DeepPartial<SubscribeResponse_AttributesEntry>): SubscribeResponse_AttributesEntry {
    const message = createBaseSubscribeResponse_AttributesEntry()
    message.key = object.key ?? ''
    message.value = object.value ?? ''
    return message
  },
}

function createBaseAction(): Action {
  return {kind: undefined}
}

export const Action = {
  encode(message: Action, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.kind?.$case === 'createMachine') {
      Action_CreateMachine.encode(message.kind.createMachine, writer.uint32(10).fork()).ldelim()
    }
    if (message.kind?.$case === 'createVolume') {
      Action_CreateVolume.encode(message.kind.createVolume, writer.uint32(18).fork()).ldelim()
    }
    if (message.kind?.$case === 'updateMachine') {
      Action_UpdateMachine.encode(message.kind.updateMachine, writer.uint32(26).fork()).ldelim()
    }
    if (message.kind?.$case === 'updateVolume') {
      Action_UpdateVolume.encode(message.kind.updateVolume, writer.uint32(34).fork()).ldelim()
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Action {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseAction()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.kind = {
            $case: 'createMachine',
            createMachine: Action_CreateMachine.decode(reader, reader.uint32()),
          }
          break
        case 2:
          message.kind = {$case: 'createVolume', createVolume: Action_CreateVolume.decode(reader, reader.uint32())}
          break
        case 3:
          message.kind = {
            $case: 'updateMachine',
            updateMachine: Action_UpdateMachine.decode(reader, reader.uint32()),
          }
          break
        case 4:
          message.kind = {$case: 'updateVolume', updateVolume: Action_UpdateVolume.decode(reader, reader.uint32())}
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): Action {
    return {
      kind: isSet(object.createMachine)
        ? {$case: 'createMachine', createMachine: Action_CreateMachine.fromJSON(object.createMachine)}
        : isSet(object.createVolume)
        ? {$case: 'createVolume', createVolume: Action_CreateVolume.fromJSON(object.createVolume)}
        : isSet(object.updateMachine)
        ? {$case: 'updateMachine', updateMachine: Action_UpdateMachine.fromJSON(object.updateMachine)}
        : isSet(object.updateVolume)
        ? {$case: 'updateVolume', updateVolume: Action_UpdateVolume.fromJSON(object.updateVolume)}
        : undefined,
    }
  },

  toJSON(message: Action): unknown {
    const obj: any = {}
    message.kind?.$case === 'createMachine' &&
      (obj.createMachine = message.kind?.createMachine
        ? Action_CreateMachine.toJSON(message.kind?.createMachine)
        : undefined)
    message.kind?.$case === 'createVolume' &&
      (obj.createVolume = message.kind?.createVolume
        ? Action_CreateVolume.toJSON(message.kind?.createVolume)
        : undefined)
    message.kind?.$case === 'updateMachine' &&
      (obj.updateMachine = message.kind?.updateMachine
        ? Action_UpdateMachine.toJSON(message.kind?.updateMachine)
        : undefined)
    message.kind?.$case === 'updateVolume' &&
      (obj.updateVolume = message.kind?.updateVolume
        ? Action_UpdateVolume.toJSON(message.kind?.updateVolume)
        : undefined)
    return obj
  },

  fromPartial(object: DeepPartial<Action>): Action {
    const message = createBaseAction()
    if (
      object.kind?.$case === 'createMachine' &&
      object.kind?.createMachine !== undefined &&
      object.kind?.createMachine !== null
    ) {
      message.kind = {
        $case: 'createMachine',
        createMachine: Action_CreateMachine.fromPartial(object.kind.createMachine),
      }
    }
    if (
      object.kind?.$case === 'createVolume' &&
      object.kind?.createVolume !== undefined &&
      object.kind?.createVolume !== null
    ) {
      message.kind = {$case: 'createVolume', createVolume: Action_CreateVolume.fromPartial(object.kind.createVolume)}
    }
    if (
      object.kind?.$case === 'updateMachine' &&
      object.kind?.updateMachine !== undefined &&
      object.kind?.updateMachine !== null
    ) {
      message.kind = {
        $case: 'updateMachine',
        updateMachine: Action_UpdateMachine.fromPartial(object.kind.updateMachine),
      }
    }
    if (
      object.kind?.$case === 'updateVolume' &&
      object.kind?.updateVolume !== undefined &&
      object.kind?.updateVolume !== null
    ) {
      message.kind = {$case: 'updateVolume', updateVolume: Action_UpdateVolume.fromPartial(object.kind.updateVolume)}
    }
    return message
  },
}

function createBaseAction_CreateMachine(): Action_CreateMachine {
  return {machineId: '', architecture: 0, image: '', securityGroup: 0}
}

export const Action_CreateMachine = {
  encode(message: Action_CreateMachine, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.machineId !== '') {
      writer.uint32(10).string(message.machineId)
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

  decode(input: _m0.Reader | Uint8Array, length?: number): Action_CreateMachine {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseAction_CreateMachine()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.machineId = reader.string()
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

  fromJSON(object: any): Action_CreateMachine {
    return {
      machineId: isSet(object.machineId) ? String(object.machineId) : '',
      architecture: isSet(object.architecture) ? architectureFromJSON(object.architecture) : 0,
      image: isSet(object.image) ? String(object.image) : '',
      securityGroup: isSet(object.securityGroup) ? securityGroupFromJSON(object.securityGroup) : 0,
    }
  },

  toJSON(message: Action_CreateMachine): unknown {
    const obj: any = {}
    message.machineId !== undefined && (obj.machineId = message.machineId)
    message.architecture !== undefined && (obj.architecture = architectureToJSON(message.architecture))
    message.image !== undefined && (obj.image = message.image)
    message.securityGroup !== undefined && (obj.securityGroup = securityGroupToJSON(message.securityGroup))
    return obj
  },

  fromPartial(object: DeepPartial<Action_CreateMachine>): Action_CreateMachine {
    const message = createBaseAction_CreateMachine()
    message.machineId = object.machineId ?? ''
    message.architecture = object.architecture ?? 0
    message.image = object.image ?? ''
    message.securityGroup = object.securityGroup ?? 0
    return message
  },
}

function createBaseAction_CreateVolume(): Action_CreateVolume {
  return {volumeId: '', orgId: '', projectId: '', size: 0}
}

export const Action_CreateVolume = {
  encode(message: Action_CreateVolume, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.volumeId !== '') {
      writer.uint32(10).string(message.volumeId)
    }
    if (message.orgId !== '') {
      writer.uint32(18).string(message.orgId)
    }
    if (message.projectId !== '') {
      writer.uint32(26).string(message.projectId)
    }
    if (message.size !== 0) {
      writer.uint32(32).int32(message.size)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Action_CreateVolume {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseAction_CreateVolume()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.volumeId = reader.string()
          break
        case 2:
          message.orgId = reader.string()
          break
        case 3:
          message.projectId = reader.string()
          break
        case 4:
          message.size = reader.int32()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): Action_CreateVolume {
    return {
      volumeId: isSet(object.volumeId) ? String(object.volumeId) : '',
      orgId: isSet(object.orgId) ? String(object.orgId) : '',
      projectId: isSet(object.projectId) ? String(object.projectId) : '',
      size: isSet(object.size) ? Number(object.size) : 0,
    }
  },

  toJSON(message: Action_CreateVolume): unknown {
    const obj: any = {}
    message.volumeId !== undefined && (obj.volumeId = message.volumeId)
    message.orgId !== undefined && (obj.orgId = message.orgId)
    message.projectId !== undefined && (obj.projectId = message.projectId)
    message.size !== undefined && (obj.size = Math.round(message.size))
    return obj
  },

  fromPartial(object: DeepPartial<Action_CreateVolume>): Action_CreateVolume {
    const message = createBaseAction_CreateVolume()
    message.volumeId = object.volumeId ?? ''
    message.orgId = object.orgId ?? ''
    message.projectId = object.projectId ?? ''
    message.size = object.size ?? 0
    return message
  },
}

function createBaseAction_UpdateMachine(): Action_UpdateMachine {
  return {machineId: '', desiredState: 0}
}

export const Action_UpdateMachine = {
  encode(message: Action_UpdateMachine, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.machineId !== '') {
      writer.uint32(10).string(message.machineId)
    }
    if (message.desiredState !== 0) {
      writer.uint32(16).int32(message.desiredState)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Action_UpdateMachine {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseAction_UpdateMachine()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.machineId = reader.string()
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

  fromJSON(object: any): Action_UpdateMachine {
    return {
      machineId: isSet(object.machineId) ? String(object.machineId) : '',
      desiredState: isSet(object.desiredState) ? machineStateFromJSON(object.desiredState) : 0,
    }
  },

  toJSON(message: Action_UpdateMachine): unknown {
    const obj: any = {}
    message.machineId !== undefined && (obj.machineId = message.machineId)
    message.desiredState !== undefined && (obj.desiredState = machineStateToJSON(message.desiredState))
    return obj
  },

  fromPartial(object: DeepPartial<Action_UpdateMachine>): Action_UpdateMachine {
    const message = createBaseAction_UpdateMachine()
    message.machineId = object.machineId ?? ''
    message.desiredState = object.desiredState ?? 0
    return message
  },
}

function createBaseAction_UpdateVolume(): Action_UpdateVolume {
  return {volumeId: '', desiredState: 0, attachment: undefined}
}

export const Action_UpdateVolume = {
  encode(message: Action_UpdateVolume, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.volumeId !== '') {
      writer.uint32(10).string(message.volumeId)
    }
    if (message.desiredState !== 0) {
      writer.uint32(16).int32(message.desiredState)
    }
    if (message.attachment !== undefined) {
      Action_UpdateVolume_Attachment.encode(message.attachment, writer.uint32(26).fork()).ldelim()
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Action_UpdateVolume {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseAction_UpdateVolume()
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
          message.attachment = Action_UpdateVolume_Attachment.decode(reader, reader.uint32())
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): Action_UpdateVolume {
    return {
      volumeId: isSet(object.volumeId) ? String(object.volumeId) : '',
      desiredState: isSet(object.desiredState) ? volumeStateFromJSON(object.desiredState) : 0,
      attachment: isSet(object.attachment) ? Action_UpdateVolume_Attachment.fromJSON(object.attachment) : undefined,
    }
  },

  toJSON(message: Action_UpdateVolume): unknown {
    const obj: any = {}
    message.volumeId !== undefined && (obj.volumeId = message.volumeId)
    message.desiredState !== undefined && (obj.desiredState = volumeStateToJSON(message.desiredState))
    message.attachment !== undefined &&
      (obj.attachment = message.attachment ? Action_UpdateVolume_Attachment.toJSON(message.attachment) : undefined)
    return obj
  },

  fromPartial(object: DeepPartial<Action_UpdateVolume>): Action_UpdateVolume {
    const message = createBaseAction_UpdateVolume()
    message.volumeId = object.volumeId ?? ''
    message.desiredState = object.desiredState ?? 0
    message.attachment =
      object.attachment !== undefined && object.attachment !== null
        ? Action_UpdateVolume_Attachment.fromPartial(object.attachment)
        : undefined
    return message
  },
}

function createBaseAction_UpdateVolume_Attachment(): Action_UpdateVolume_Attachment {
  return {machineResourceId: '', device: ''}
}

export const Action_UpdateVolume_Attachment = {
  encode(message: Action_UpdateVolume_Attachment, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.machineResourceId !== '') {
      writer.uint32(10).string(message.machineResourceId)
    }
    if (message.device !== '') {
      writer.uint32(18).string(message.device)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Action_UpdateVolume_Attachment {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseAction_UpdateVolume_Attachment()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.machineResourceId = reader.string()
          break
        case 2:
          message.device = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): Action_UpdateVolume_Attachment {
    return {
      machineResourceId: isSet(object.machineResourceId) ? String(object.machineResourceId) : '',
      device: isSet(object.device) ? String(object.device) : '',
    }
  },

  toJSON(message: Action_UpdateVolume_Attachment): unknown {
    const obj: any = {}
    message.machineResourceId !== undefined && (obj.machineResourceId = message.machineResourceId)
    message.device !== undefined && (obj.device = message.device)
    return obj
  },

  fromPartial(object: DeepPartial<Action_UpdateVolume_Attachment>): Action_UpdateVolume_Attachment {
    const message = createBaseAction_UpdateVolume_Attachment()
    message.machineResourceId = object.machineResourceId ?? ''
    message.device = object.device ?? ''
    return message
  },
}

function createBaseGetMachineEtagsRequest(): GetMachineEtagsRequest {
  return {}
}

export const GetMachineEtagsRequest = {
  encode(_: GetMachineEtagsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetMachineEtagsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseGetMachineEtagsRequest()
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

  fromJSON(_: any): GetMachineEtagsRequest {
    return {}
  },

  toJSON(_: GetMachineEtagsRequest): unknown {
    const obj: any = {}
    return obj
  },

  fromPartial(_: DeepPartial<GetMachineEtagsRequest>): GetMachineEtagsRequest {
    const message = createBaseGetMachineEtagsRequest()
    return message
  },
}

function createBaseGetMachineEtagsResponse(): GetMachineEtagsResponse {
  return {etags: {}}
}

export const GetMachineEtagsResponse = {
  encode(message: GetMachineEtagsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    Object.entries(message.etags).forEach(([key, value]) => {
      GetMachineEtagsResponse_EtagsEntry.encode({key: key as any, value}, writer.uint32(10).fork()).ldelim()
    })
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetMachineEtagsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseGetMachineEtagsResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          const entry1 = GetMachineEtagsResponse_EtagsEntry.decode(reader, reader.uint32())
          if (entry1.value !== undefined) {
            message.etags[entry1.key] = entry1.value
          }
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): GetMachineEtagsResponse {
    return {
      etags: isObject(object.etags)
        ? Object.entries(object.etags).reduce<{[key: string]: string}>((acc, [key, value]) => {
            acc[key] = String(value)
            return acc
          }, {})
        : {},
    }
  },

  toJSON(message: GetMachineEtagsResponse): unknown {
    const obj: any = {}
    obj.etags = {}
    if (message.etags) {
      Object.entries(message.etags).forEach(([k, v]) => {
        obj.etags[k] = v
      })
    }
    return obj
  },

  fromPartial(object: DeepPartial<GetMachineEtagsResponse>): GetMachineEtagsResponse {
    const message = createBaseGetMachineEtagsResponse()
    message.etags = Object.entries(object.etags ?? {}).reduce<{[key: string]: string}>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = String(value)
      }
      return acc
    }, {})
    return message
  },
}

function createBaseGetMachineEtagsResponse_EtagsEntry(): GetMachineEtagsResponse_EtagsEntry {
  return {key: '', value: ''}
}

export const GetMachineEtagsResponse_EtagsEntry = {
  encode(message: GetMachineEtagsResponse_EtagsEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== '') {
      writer.uint32(10).string(message.key)
    }
    if (message.value !== '') {
      writer.uint32(18).string(message.value)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetMachineEtagsResponse_EtagsEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseGetMachineEtagsResponse_EtagsEntry()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string()
          break
        case 2:
          message.value = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): GetMachineEtagsResponse_EtagsEntry {
    return {key: isSet(object.key) ? String(object.key) : '', value: isSet(object.value) ? String(object.value) : ''}
  },

  toJSON(message: GetMachineEtagsResponse_EtagsEntry): unknown {
    const obj: any = {}
    message.key !== undefined && (obj.key = message.key)
    message.value !== undefined && (obj.value = message.value)
    return obj
  },

  fromPartial(object: DeepPartial<GetMachineEtagsResponse_EtagsEntry>): GetMachineEtagsResponse_EtagsEntry {
    const message = createBaseGetMachineEtagsResponse_EtagsEntry()
    message.key = object.key ?? ''
    message.value = object.value ?? ''
    return message
  },
}

function createBaseGetVolumeEtagsRequest(): GetVolumeEtagsRequest {
  return {}
}

export const GetVolumeEtagsRequest = {
  encode(_: GetVolumeEtagsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetVolumeEtagsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseGetVolumeEtagsRequest()
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

  fromJSON(_: any): GetVolumeEtagsRequest {
    return {}
  },

  toJSON(_: GetVolumeEtagsRequest): unknown {
    const obj: any = {}
    return obj
  },

  fromPartial(_: DeepPartial<GetVolumeEtagsRequest>): GetVolumeEtagsRequest {
    const message = createBaseGetVolumeEtagsRequest()
    return message
  },
}

function createBaseGetVolumeEtagsResponse(): GetVolumeEtagsResponse {
  return {etags: {}}
}

export const GetVolumeEtagsResponse = {
  encode(message: GetVolumeEtagsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    Object.entries(message.etags).forEach(([key, value]) => {
      GetVolumeEtagsResponse_EtagsEntry.encode({key: key as any, value}, writer.uint32(10).fork()).ldelim()
    })
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetVolumeEtagsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseGetVolumeEtagsResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          const entry1 = GetVolumeEtagsResponse_EtagsEntry.decode(reader, reader.uint32())
          if (entry1.value !== undefined) {
            message.etags[entry1.key] = entry1.value
          }
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): GetVolumeEtagsResponse {
    return {
      etags: isObject(object.etags)
        ? Object.entries(object.etags).reduce<{[key: string]: string}>((acc, [key, value]) => {
            acc[key] = String(value)
            return acc
          }, {})
        : {},
    }
  },

  toJSON(message: GetVolumeEtagsResponse): unknown {
    const obj: any = {}
    obj.etags = {}
    if (message.etags) {
      Object.entries(message.etags).forEach(([k, v]) => {
        obj.etags[k] = v
      })
    }
    return obj
  },

  fromPartial(object: DeepPartial<GetVolumeEtagsResponse>): GetVolumeEtagsResponse {
    const message = createBaseGetVolumeEtagsResponse()
    message.etags = Object.entries(object.etags ?? {}).reduce<{[key: string]: string}>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = String(value)
      }
      return acc
    }, {})
    return message
  },
}

function createBaseGetVolumeEtagsResponse_EtagsEntry(): GetVolumeEtagsResponse_EtagsEntry {
  return {key: '', value: ''}
}

export const GetVolumeEtagsResponse_EtagsEntry = {
  encode(message: GetVolumeEtagsResponse_EtagsEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== '') {
      writer.uint32(10).string(message.key)
    }
    if (message.value !== '') {
      writer.uint32(18).string(message.value)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetVolumeEtagsResponse_EtagsEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseGetVolumeEtagsResponse_EtagsEntry()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string()
          break
        case 2:
          message.value = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): GetVolumeEtagsResponse_EtagsEntry {
    return {key: isSet(object.key) ? String(object.key) : '', value: isSet(object.value) ? String(object.value) : ''}
  },

  toJSON(message: GetVolumeEtagsResponse_EtagsEntry): unknown {
    const obj: any = {}
    message.key !== undefined && (obj.key = message.key)
    message.value !== undefined && (obj.value = message.value)
    return obj
  },

  fromPartial(object: DeepPartial<GetVolumeEtagsResponse_EtagsEntry>): GetVolumeEtagsResponse_EtagsEntry {
    const message = createBaseGetVolumeEtagsResponse_EtagsEntry()
    message.key = object.key ?? ''
    message.value = object.value ?? ''
    return message
  },
}

function createBaseReportMachineStateRequest(): ReportMachineStateRequest {
  return {machineId: '', etag: '', state: ''}
}

export const ReportMachineStateRequest = {
  encode(message: ReportMachineStateRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.machineId !== '') {
      writer.uint32(10).string(message.machineId)
    }
    if (message.etag !== '') {
      writer.uint32(18).string(message.etag)
    }
    if (message.state !== '') {
      writer.uint32(26).string(message.state)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReportMachineStateRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseReportMachineStateRequest()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.machineId = reader.string()
          break
        case 2:
          message.etag = reader.string()
          break
        case 3:
          message.state = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): ReportMachineStateRequest {
    return {
      machineId: isSet(object.machineId) ? String(object.machineId) : '',
      etag: isSet(object.etag) ? String(object.etag) : '',
      state: isSet(object.state) ? String(object.state) : '',
    }
  },

  toJSON(message: ReportMachineStateRequest): unknown {
    const obj: any = {}
    message.machineId !== undefined && (obj.machineId = message.machineId)
    message.etag !== undefined && (obj.etag = message.etag)
    message.state !== undefined && (obj.state = message.state)
    return obj
  },

  fromPartial(object: DeepPartial<ReportMachineStateRequest>): ReportMachineStateRequest {
    const message = createBaseReportMachineStateRequest()
    message.machineId = object.machineId ?? ''
    message.etag = object.etag ?? ''
    message.state = object.state ?? ''
    return message
  },
}

function createBaseReportMachineStateResponse(): ReportMachineStateResponse {
  return {}
}

export const ReportMachineStateResponse = {
  encode(_: ReportMachineStateResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReportMachineStateResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseReportMachineStateResponse()
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

  fromJSON(_: any): ReportMachineStateResponse {
    return {}
  },

  toJSON(_: ReportMachineStateResponse): unknown {
    const obj: any = {}
    return obj
  },

  fromPartial(_: DeepPartial<ReportMachineStateResponse>): ReportMachineStateResponse {
    const message = createBaseReportMachineStateResponse()
    return message
  },
}

function createBaseReportVolumeStateRequest(): ReportVolumeStateRequest {
  return {volumeId: '', etag: '', state: ''}
}

export const ReportVolumeStateRequest = {
  encode(message: ReportVolumeStateRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.volumeId !== '') {
      writer.uint32(10).string(message.volumeId)
    }
    if (message.etag !== '') {
      writer.uint32(18).string(message.etag)
    }
    if (message.state !== '') {
      writer.uint32(26).string(message.state)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReportVolumeStateRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseReportVolumeStateRequest()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.volumeId = reader.string()
          break
        case 2:
          message.etag = reader.string()
          break
        case 3:
          message.state = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): ReportVolumeStateRequest {
    return {
      volumeId: isSet(object.volumeId) ? String(object.volumeId) : '',
      etag: isSet(object.etag) ? String(object.etag) : '',
      state: isSet(object.state) ? String(object.state) : '',
    }
  },

  toJSON(message: ReportVolumeStateRequest): unknown {
    const obj: any = {}
    message.volumeId !== undefined && (obj.volumeId = message.volumeId)
    message.etag !== undefined && (obj.etag = message.etag)
    message.state !== undefined && (obj.state = message.state)
    return obj
  },

  fromPartial(object: DeepPartial<ReportVolumeStateRequest>): ReportVolumeStateRequest {
    const message = createBaseReportVolumeStateRequest()
    message.volumeId = object.volumeId ?? ''
    message.etag = object.etag ?? ''
    message.state = object.state ?? ''
    return message
  },
}

function createBaseReportVolumeStateResponse(): ReportVolumeStateResponse {
  return {}
}

export const ReportVolumeStateResponse = {
  encode(_: ReportVolumeStateResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReportVolumeStateResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseReportVolumeStateResponse()
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

  fromJSON(_: any): ReportVolumeStateResponse {
    return {}
  },

  toJSON(_: ReportVolumeStateResponse): unknown {
    const obj: any = {}
    return obj
  },

  fromPartial(_: DeepPartial<ReportVolumeStateResponse>): ReportVolumeStateResponse {
    const message = createBaseReportVolumeStateResponse()
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
    subscribe: {
      name: 'Subscribe',
      requestType: SubscribeRequest,
      requestStream: true,
      responseType: SubscribeResponse,
      responseStream: true,
      options: {},
    },
    getMachineEtags: {
      name: 'GetMachineEtags',
      requestType: GetMachineEtagsRequest,
      requestStream: false,
      responseType: GetMachineEtagsResponse,
      responseStream: false,
      options: {},
    },
    getVolumeEtags: {
      name: 'GetVolumeEtags',
      requestType: GetVolumeEtagsRequest,
      requestStream: false,
      responseType: GetVolumeEtagsResponse,
      responseStream: false,
      options: {},
    },
    reportMachineState: {
      name: 'ReportMachineState',
      requestType: ReportMachineStateRequest,
      requestStream: false,
      responseType: ReportMachineStateResponse,
      responseStream: false,
      options: {},
    },
    reportVolumeState: {
      name: 'ReportVolumeState',
      requestType: ReportVolumeStateRequest,
      requestStream: false,
      responseType: ReportVolumeStateResponse,
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
  subscribe(
    request: AsyncIterable<SubscribeRequest>,
    context: CallContext & CallContextExt,
  ): ServerStreamingMethodResult<DeepPartial<SubscribeResponse>>
  getMachineEtags(
    request: GetMachineEtagsRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<GetMachineEtagsResponse>>
  getVolumeEtags(
    request: GetVolumeEtagsRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<GetVolumeEtagsResponse>>
  reportMachineState(
    request: ReportMachineStateRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<ReportMachineStateResponse>>
  reportVolumeState(
    request: ReportVolumeStateRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<ReportVolumeStateResponse>>
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
  subscribe(
    request: AsyncIterable<DeepPartial<SubscribeRequest>>,
    options?: CallOptions & CallOptionsExt,
  ): AsyncIterable<SubscribeResponse>
  getMachineEtags(
    request: DeepPartial<GetMachineEtagsRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<GetMachineEtagsResponse>
  getVolumeEtags(
    request: DeepPartial<GetVolumeEtagsRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<GetVolumeEtagsResponse>
  reportMachineState(
    request: DeepPartial<ReportMachineStateRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<ReportMachineStateResponse>
  reportVolumeState(
    request: DeepPartial<ReportVolumeStateRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<ReportVolumeStateResponse>
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

function isObject(value: any): boolean {
  return typeof value === 'object' && value !== null
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined
}

export type ServerStreamingMethodResult<Response> = {[Symbol.asyncIterator](): AsyncIterator<Response, void>}
