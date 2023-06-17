// @generated by protoc-gen-es v1.2.1 with parameter "target=ts,import_extension=none"
// @generated from file depot/cloud/v2/cloud.proto (package depot.cloud.v2, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type {
  BinaryReadOptions,
  FieldList,
  JsonReadOptions,
  JsonValue,
  PartialMessage,
  PlainMessage,
} from '@bufbuild/protobuf'
import {Message, proto3} from '@bufbuild/protobuf'

/**
 * @generated from message depot.cloud.v2.GetDesiredStateRequest
 */
export class GetDesiredStateRequest extends Message<GetDesiredStateRequest> {
  /**
   * @generated from field: string connection_id = 1;
   */
  connectionId = ''

  constructor(data?: PartialMessage<GetDesiredStateRequest>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'depot.cloud.v2.GetDesiredStateRequest'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    {no: 1, name: 'connection_id', kind: 'scalar', T: 9 /* ScalarType.STRING */},
  ])

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetDesiredStateRequest {
    return new GetDesiredStateRequest().fromBinary(bytes, options)
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetDesiredStateRequest {
    return new GetDesiredStateRequest().fromJson(jsonValue, options)
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetDesiredStateRequest {
    return new GetDesiredStateRequest().fromJsonString(jsonString, options)
  }

  static equals(
    a: GetDesiredStateRequest | PlainMessage<GetDesiredStateRequest> | undefined,
    b: GetDesiredStateRequest | PlainMessage<GetDesiredStateRequest> | undefined,
  ): boolean {
    return proto3.util.equals(GetDesiredStateRequest, a, b)
  }
}

/**
 * @generated from message depot.cloud.v2.GetDesiredStateResponse
 */
export class GetDesiredStateResponse extends Message<GetDesiredStateResponse> {
  /**
   * @generated from field: repeated depot.cloud.v2.GetDesiredStateResponse.NewMachine new_machines = 1;
   */
  newMachines: GetDesiredStateResponse_NewMachine[] = []

  /**
   * @generated from field: repeated depot.cloud.v2.GetDesiredStateResponse.NewVolume new_volumes = 2;
   */
  newVolumes: GetDesiredStateResponse_NewVolume[] = []

  /**
   * @generated from field: repeated depot.cloud.v2.GetDesiredStateResponse.MachineChange machine_changes = 3;
   */
  machineChanges: GetDesiredStateResponse_MachineChange[] = []

  /**
   * @generated from field: repeated depot.cloud.v2.GetDesiredStateResponse.VolumeChange volume_changes = 4;
   */
  volumeChanges: GetDesiredStateResponse_VolumeChange[] = []

  constructor(data?: PartialMessage<GetDesiredStateResponse>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'depot.cloud.v2.GetDesiredStateResponse'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    {no: 1, name: 'new_machines', kind: 'message', T: GetDesiredStateResponse_NewMachine, repeated: true},
    {no: 2, name: 'new_volumes', kind: 'message', T: GetDesiredStateResponse_NewVolume, repeated: true},
    {no: 3, name: 'machine_changes', kind: 'message', T: GetDesiredStateResponse_MachineChange, repeated: true},
    {no: 4, name: 'volume_changes', kind: 'message', T: GetDesiredStateResponse_VolumeChange, repeated: true},
  ])

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetDesiredStateResponse {
    return new GetDesiredStateResponse().fromBinary(bytes, options)
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetDesiredStateResponse {
    return new GetDesiredStateResponse().fromJson(jsonValue, options)
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetDesiredStateResponse {
    return new GetDesiredStateResponse().fromJsonString(jsonString, options)
  }

  static equals(
    a: GetDesiredStateResponse | PlainMessage<GetDesiredStateResponse> | undefined,
    b: GetDesiredStateResponse | PlainMessage<GetDesiredStateResponse> | undefined,
  ): boolean {
    return proto3.util.equals(GetDesiredStateResponse, a, b)
  }
}

/**
 * @generated from enum depot.cloud.v2.GetDesiredStateResponse.Architecture
 */
export enum GetDesiredStateResponse_Architecture {
  /**
   * @generated from enum value: ARCHITECTURE_UNSPECIFIED = 0;
   */
  UNSPECIFIED = 0,

  /**
   * @generated from enum value: ARCHITECTURE_X86 = 1;
   */
  X86 = 1,

  /**
   * @generated from enum value: ARCHITECTURE_ARM = 2;
   */
  ARM = 2,
}
// Retrieve enum metadata with: proto3.getEnumType(GetDesiredStateResponse_Architecture)
proto3.util.setEnumType(GetDesiredStateResponse_Architecture, 'depot.cloud.v2.GetDesiredStateResponse.Architecture', [
  {no: 0, name: 'ARCHITECTURE_UNSPECIFIED'},
  {no: 1, name: 'ARCHITECTURE_X86'},
  {no: 2, name: 'ARCHITECTURE_ARM'},
])

/**
 * @generated from enum depot.cloud.v2.GetDesiredStateResponse.Kind
 */
export enum GetDesiredStateResponse_Kind {
  /**
   * @generated from enum value: KIND_UNSPECIFIED = 0;
   */
  UNSPECIFIED = 0,

  /**
   * @generated from enum value: KIND_BUILDKIT = 1;
   */
  BUILDKIT = 1,
}
// Retrieve enum metadata with: proto3.getEnumType(GetDesiredStateResponse_Kind)
proto3.util.setEnumType(GetDesiredStateResponse_Kind, 'depot.cloud.v2.GetDesiredStateResponse.Kind', [
  {no: 0, name: 'KIND_UNSPECIFIED'},
  {no: 1, name: 'KIND_BUILDKIT'},
])

/**
 * @generated from enum depot.cloud.v2.GetDesiredStateResponse.MachineState
 */
export enum GetDesiredStateResponse_MachineState {
  /**
   * @generated from enum value: MACHINE_STATE_UNSPECIFIED = 0;
   */
  UNSPECIFIED = 0,

  /**
   * @generated from enum value: MACHINE_STATE_PENDING = 1;
   */
  PENDING = 1,

  /**
   * @generated from enum value: MACHINE_STATE_RUNNING = 2;
   */
  RUNNING = 2,

  /**
   * @generated from enum value: MACHINE_STATE_STOPPING = 3;
   */
  STOPPING = 3,

  /**
   * @generated from enum value: MACHINE_STATE_STOPPED = 4;
   */
  STOPPED = 4,

  /**
   * @generated from enum value: MACHINE_STATE_DELETING = 5;
   */
  DELETING = 5,

  /**
   * @generated from enum value: MACHINE_STATE_DELETED = 6;
   */
  DELETED = 6,

  /**
   * @generated from enum value: MACHINE_STATE_ERROR = 7;
   */
  ERROR = 7,
}
// Retrieve enum metadata with: proto3.getEnumType(GetDesiredStateResponse_MachineState)
proto3.util.setEnumType(GetDesiredStateResponse_MachineState, 'depot.cloud.v2.GetDesiredStateResponse.MachineState', [
  {no: 0, name: 'MACHINE_STATE_UNSPECIFIED'},
  {no: 1, name: 'MACHINE_STATE_PENDING'},
  {no: 2, name: 'MACHINE_STATE_RUNNING'},
  {no: 3, name: 'MACHINE_STATE_STOPPING'},
  {no: 4, name: 'MACHINE_STATE_STOPPED'},
  {no: 5, name: 'MACHINE_STATE_DELETING'},
  {no: 6, name: 'MACHINE_STATE_DELETED'},
  {no: 7, name: 'MACHINE_STATE_ERROR'},
])

/**
 * @generated from enum depot.cloud.v2.GetDesiredStateResponse.SecurityGroup
 */
export enum GetDesiredStateResponse_SecurityGroup {
  /**
   * @generated from enum value: SECURITY_GROUP_UNSPECIFIED = 0;
   */
  UNSPECIFIED = 0,

  /**
   * @generated from enum value: SECURITY_GROUP_DEFAULT = 1;
   */
  DEFAULT = 1,

  /**
   * @generated from enum value: SECURITY_GROUP_BUILDKIT = 2;
   */
  BUILDKIT = 2,
}
// Retrieve enum metadata with: proto3.getEnumType(GetDesiredStateResponse_SecurityGroup)
proto3.util.setEnumType(GetDesiredStateResponse_SecurityGroup, 'depot.cloud.v2.GetDesiredStateResponse.SecurityGroup', [
  {no: 0, name: 'SECURITY_GROUP_UNSPECIFIED'},
  {no: 1, name: 'SECURITY_GROUP_DEFAULT'},
  {no: 2, name: 'SECURITY_GROUP_BUILDKIT'},
])

/**
 * @generated from enum depot.cloud.v2.GetDesiredStateResponse.VolumeState
 */
export enum GetDesiredStateResponse_VolumeState {
  /**
   * @generated from enum value: VOLUME_STATE_UNSPECIFIED = 0;
   */
  UNSPECIFIED = 0,

  /**
   * @generated from enum value: VOLUME_STATE_PENDING = 1;
   */
  PENDING = 1,

  /**
   * @generated from enum value: VOLUME_STATE_AVAILABLE = 2;
   */
  AVAILABLE = 2,

  /**
   * @generated from enum value: VOLUME_STATE_ATTACHED = 3;
   */
  ATTACHED = 3,

  /**
   * @generated from enum value: VOLUME_STATE_DELETED = 4;
   */
  DELETED = 4,

  /**
   * @generated from enum value: VOLUME_STATE_ERROR = 5;
   */
  ERROR = 5,
}
// Retrieve enum metadata with: proto3.getEnumType(GetDesiredStateResponse_VolumeState)
proto3.util.setEnumType(GetDesiredStateResponse_VolumeState, 'depot.cloud.v2.GetDesiredStateResponse.VolumeState', [
  {no: 0, name: 'VOLUME_STATE_UNSPECIFIED'},
  {no: 1, name: 'VOLUME_STATE_PENDING'},
  {no: 2, name: 'VOLUME_STATE_AVAILABLE'},
  {no: 3, name: 'VOLUME_STATE_ATTACHED'},
  {no: 4, name: 'VOLUME_STATE_DELETED'},
  {no: 5, name: 'VOLUME_STATE_ERROR'},
])

/**
 * @generated from message depot.cloud.v2.GetDesiredStateResponse.NewMachine
 */
export class GetDesiredStateResponse_NewMachine extends Message<GetDesiredStateResponse_NewMachine> {
  /**
   * @generated from field: string id = 1;
   */
  id = ''

  /**
   * @generated from field: string realm = 2;
   */
  realm = ''

  /**
   * @generated from field: depot.cloud.v2.GetDesiredStateResponse.Kind kind = 3;
   */
  kind = GetDesiredStateResponse_Kind.UNSPECIFIED

  /**
   * @generated from field: depot.cloud.v2.GetDesiredStateResponse.Architecture architecture = 4;
   */
  architecture = GetDesiredStateResponse_Architecture.UNSPECIFIED

  /**
   * @generated from field: string image = 5;
   */
  image = ''

  /**
   * @generated from field: depot.cloud.v2.GetDesiredStateResponse.SecurityGroup security_group = 6;
   */
  securityGroup = GetDesiredStateResponse_SecurityGroup.UNSPECIFIED

  constructor(data?: PartialMessage<GetDesiredStateResponse_NewMachine>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'depot.cloud.v2.GetDesiredStateResponse.NewMachine'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    {no: 1, name: 'id', kind: 'scalar', T: 9 /* ScalarType.STRING */},
    {no: 2, name: 'realm', kind: 'scalar', T: 9 /* ScalarType.STRING */},
    {no: 3, name: 'kind', kind: 'enum', T: proto3.getEnumType(GetDesiredStateResponse_Kind)},
    {no: 4, name: 'architecture', kind: 'enum', T: proto3.getEnumType(GetDesiredStateResponse_Architecture)},
    {no: 5, name: 'image', kind: 'scalar', T: 9 /* ScalarType.STRING */},
    {no: 6, name: 'security_group', kind: 'enum', T: proto3.getEnumType(GetDesiredStateResponse_SecurityGroup)},
  ])

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetDesiredStateResponse_NewMachine {
    return new GetDesiredStateResponse_NewMachine().fromBinary(bytes, options)
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetDesiredStateResponse_NewMachine {
    return new GetDesiredStateResponse_NewMachine().fromJson(jsonValue, options)
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetDesiredStateResponse_NewMachine {
    return new GetDesiredStateResponse_NewMachine().fromJsonString(jsonString, options)
  }

  static equals(
    a: GetDesiredStateResponse_NewMachine | PlainMessage<GetDesiredStateResponse_NewMachine> | undefined,
    b: GetDesiredStateResponse_NewMachine | PlainMessage<GetDesiredStateResponse_NewMachine> | undefined,
  ): boolean {
    return proto3.util.equals(GetDesiredStateResponse_NewMachine, a, b)
  }
}

/**
 * @generated from message depot.cloud.v2.GetDesiredStateResponse.NewVolume
 */
export class GetDesiredStateResponse_NewVolume extends Message<GetDesiredStateResponse_NewVolume> {
  /**
   * @generated from field: string id = 1;
   */
  id = ''

  /**
   * @generated from field: string realm = 2;
   */
  realm = ''

  /**
   * @generated from field: depot.cloud.v2.GetDesiredStateResponse.Kind kind = 3;
   */
  kind = GetDesiredStateResponse_Kind.UNSPECIFIED

  /**
   * @generated from field: depot.cloud.v2.GetDesiredStateResponse.Architecture architecture = 4;
   */
  architecture = GetDesiredStateResponse_Architecture.UNSPECIFIED

  /**
   * @generated from field: int32 size = 5;
   */
  size = 0

  constructor(data?: PartialMessage<GetDesiredStateResponse_NewVolume>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'depot.cloud.v2.GetDesiredStateResponse.NewVolume'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    {no: 1, name: 'id', kind: 'scalar', T: 9 /* ScalarType.STRING */},
    {no: 2, name: 'realm', kind: 'scalar', T: 9 /* ScalarType.STRING */},
    {no: 3, name: 'kind', kind: 'enum', T: proto3.getEnumType(GetDesiredStateResponse_Kind)},
    {no: 4, name: 'architecture', kind: 'enum', T: proto3.getEnumType(GetDesiredStateResponse_Architecture)},
    {no: 5, name: 'size', kind: 'scalar', T: 5 /* ScalarType.INT32 */},
  ])

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetDesiredStateResponse_NewVolume {
    return new GetDesiredStateResponse_NewVolume().fromBinary(bytes, options)
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetDesiredStateResponse_NewVolume {
    return new GetDesiredStateResponse_NewVolume().fromJson(jsonValue, options)
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetDesiredStateResponse_NewVolume {
    return new GetDesiredStateResponse_NewVolume().fromJsonString(jsonString, options)
  }

  static equals(
    a: GetDesiredStateResponse_NewVolume | PlainMessage<GetDesiredStateResponse_NewVolume> | undefined,
    b: GetDesiredStateResponse_NewVolume | PlainMessage<GetDesiredStateResponse_NewVolume> | undefined,
  ): boolean {
    return proto3.util.equals(GetDesiredStateResponse_NewVolume, a, b)
  }
}

/**
 * @generated from message depot.cloud.v2.GetDesiredStateResponse.MachineChange
 */
export class GetDesiredStateResponse_MachineChange extends Message<GetDesiredStateResponse_MachineChange> {
  /**
   * @generated from field: string id = 1;
   */
  id = ''

  /**
   * @generated from field: depot.cloud.v2.GetDesiredStateResponse.MachineState desired_state = 2;
   */
  desiredState = GetDesiredStateResponse_MachineState.UNSPECIFIED

  constructor(data?: PartialMessage<GetDesiredStateResponse_MachineChange>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'depot.cloud.v2.GetDesiredStateResponse.MachineChange'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    {no: 1, name: 'id', kind: 'scalar', T: 9 /* ScalarType.STRING */},
    {no: 2, name: 'desired_state', kind: 'enum', T: proto3.getEnumType(GetDesiredStateResponse_MachineState)},
  ])

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetDesiredStateResponse_MachineChange {
    return new GetDesiredStateResponse_MachineChange().fromBinary(bytes, options)
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetDesiredStateResponse_MachineChange {
    return new GetDesiredStateResponse_MachineChange().fromJson(jsonValue, options)
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetDesiredStateResponse_MachineChange {
    return new GetDesiredStateResponse_MachineChange().fromJsonString(jsonString, options)
  }

  static equals(
    a: GetDesiredStateResponse_MachineChange | PlainMessage<GetDesiredStateResponse_MachineChange> | undefined,
    b: GetDesiredStateResponse_MachineChange | PlainMessage<GetDesiredStateResponse_MachineChange> | undefined,
  ): boolean {
    return proto3.util.equals(GetDesiredStateResponse_MachineChange, a, b)
  }
}

/**
 * @generated from message depot.cloud.v2.GetDesiredStateResponse.VolumeChange
 */
export class GetDesiredStateResponse_VolumeChange extends Message<GetDesiredStateResponse_VolumeChange> {
  /**
   * @generated from field: string id = 1;
   */
  id = ''

  /**
   * @generated from field: depot.cloud.v2.GetDesiredStateResponse.VolumeState desired_state = 2;
   */
  desiredState = GetDesiredStateResponse_VolumeState.UNSPECIFIED

  /**
   * @generated from field: optional string attached_to = 3;
   */
  attachedTo?: string

  /**
   * @generated from field: optional string device = 4;
   */
  device?: string

  constructor(data?: PartialMessage<GetDesiredStateResponse_VolumeChange>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'depot.cloud.v2.GetDesiredStateResponse.VolumeChange'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    {no: 1, name: 'id', kind: 'scalar', T: 9 /* ScalarType.STRING */},
    {no: 2, name: 'desired_state', kind: 'enum', T: proto3.getEnumType(GetDesiredStateResponse_VolumeState)},
    {no: 3, name: 'attached_to', kind: 'scalar', T: 9 /* ScalarType.STRING */, opt: true},
    {no: 4, name: 'device', kind: 'scalar', T: 9 /* ScalarType.STRING */, opt: true},
  ])

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetDesiredStateResponse_VolumeChange {
    return new GetDesiredStateResponse_VolumeChange().fromBinary(bytes, options)
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetDesiredStateResponse_VolumeChange {
    return new GetDesiredStateResponse_VolumeChange().fromJson(jsonValue, options)
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetDesiredStateResponse_VolumeChange {
    return new GetDesiredStateResponse_VolumeChange().fromJsonString(jsonString, options)
  }

  static equals(
    a: GetDesiredStateResponse_VolumeChange | PlainMessage<GetDesiredStateResponse_VolumeChange> | undefined,
    b: GetDesiredStateResponse_VolumeChange | PlainMessage<GetDesiredStateResponse_VolumeChange> | undefined,
  ): boolean {
    return proto3.util.equals(GetDesiredStateResponse_VolumeChange, a, b)
  }
}

/**
 * @generated from message depot.cloud.v2.ReportCurrentStateRequest
 */
export class ReportCurrentStateRequest extends Message<ReportCurrentStateRequest> {
  /**
   * @generated from field: string connection_id = 1;
   */
  connectionId = ''

  /**
   * @generated from oneof depot.cloud.v2.ReportCurrentStateRequest.state
   */
  state:
    | {
        /**
         * @generated from field: depot.cloud.v2.CloudState replace = 2;
         */
        value: CloudState
        case: 'replace'
      }
    | {
        /**
         * @generated from field: depot.cloud.v2.CloudStatePatch patch = 3;
         */
        value: CloudStatePatch
        case: 'patch'
      }
    | {case: undefined; value?: undefined} = {case: undefined}

  constructor(data?: PartialMessage<ReportCurrentStateRequest>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'depot.cloud.v2.ReportCurrentStateRequest'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    {no: 1, name: 'connection_id', kind: 'scalar', T: 9 /* ScalarType.STRING */},
    {no: 2, name: 'replace', kind: 'message', T: CloudState, oneof: 'state'},
    {no: 3, name: 'patch', kind: 'message', T: CloudStatePatch, oneof: 'state'},
  ])

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ReportCurrentStateRequest {
    return new ReportCurrentStateRequest().fromBinary(bytes, options)
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ReportCurrentStateRequest {
    return new ReportCurrentStateRequest().fromJson(jsonValue, options)
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ReportCurrentStateRequest {
    return new ReportCurrentStateRequest().fromJsonString(jsonString, options)
  }

  static equals(
    a: ReportCurrentStateRequest | PlainMessage<ReportCurrentStateRequest> | undefined,
    b: ReportCurrentStateRequest | PlainMessage<ReportCurrentStateRequest> | undefined,
  ): boolean {
    return proto3.util.equals(ReportCurrentStateRequest, a, b)
  }
}

/**
 * @generated from message depot.cloud.v2.ReportCurrentStateResponse
 */
export class ReportCurrentStateResponse extends Message<ReportCurrentStateResponse> {
  /**
   * @generated from field: int32 generation = 1;
   */
  generation = 0

  constructor(data?: PartialMessage<ReportCurrentStateResponse>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'depot.cloud.v2.ReportCurrentStateResponse'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    {no: 1, name: 'generation', kind: 'scalar', T: 5 /* ScalarType.INT32 */},
  ])

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ReportCurrentStateResponse {
    return new ReportCurrentStateResponse().fromBinary(bytes, options)
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ReportCurrentStateResponse {
    return new ReportCurrentStateResponse().fromJson(jsonValue, options)
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ReportCurrentStateResponse {
    return new ReportCurrentStateResponse().fromJsonString(jsonString, options)
  }

  static equals(
    a: ReportCurrentStateResponse | PlainMessage<ReportCurrentStateResponse> | undefined,
    b: ReportCurrentStateResponse | PlainMessage<ReportCurrentStateResponse> | undefined,
  ): boolean {
    return proto3.util.equals(ReportCurrentStateResponse, a, b)
  }
}

/**
 * @generated from message depot.cloud.v2.ReportErrorsRequest
 */
export class ReportErrorsRequest extends Message<ReportErrorsRequest> {
  /**
   * @generated from field: string connection_id = 1;
   */
  connectionId = ''

  /**
   * @generated from field: repeated string errors = 2;
   */
  errors: string[] = []

  constructor(data?: PartialMessage<ReportErrorsRequest>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'depot.cloud.v2.ReportErrorsRequest'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    {no: 1, name: 'connection_id', kind: 'scalar', T: 9 /* ScalarType.STRING */},
    {no: 2, name: 'errors', kind: 'scalar', T: 9 /* ScalarType.STRING */, repeated: true},
  ])

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ReportErrorsRequest {
    return new ReportErrorsRequest().fromBinary(bytes, options)
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ReportErrorsRequest {
    return new ReportErrorsRequest().fromJson(jsonValue, options)
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ReportErrorsRequest {
    return new ReportErrorsRequest().fromJsonString(jsonString, options)
  }

  static equals(
    a: ReportErrorsRequest | PlainMessage<ReportErrorsRequest> | undefined,
    b: ReportErrorsRequest | PlainMessage<ReportErrorsRequest> | undefined,
  ): boolean {
    return proto3.util.equals(ReportErrorsRequest, a, b)
  }
}

/**
 * @generated from message depot.cloud.v2.ReportErrorsResponse
 */
export class ReportErrorsResponse extends Message<ReportErrorsResponse> {
  constructor(data?: PartialMessage<ReportErrorsResponse>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'depot.cloud.v2.ReportErrorsResponse'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [])

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ReportErrorsResponse {
    return new ReportErrorsResponse().fromBinary(bytes, options)
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ReportErrorsResponse {
    return new ReportErrorsResponse().fromJson(jsonValue, options)
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ReportErrorsResponse {
    return new ReportErrorsResponse().fromJsonString(jsonString, options)
  }

  static equals(
    a: ReportErrorsResponse | PlainMessage<ReportErrorsResponse> | undefined,
    b: ReportErrorsResponse | PlainMessage<ReportErrorsResponse> | undefined,
  ): boolean {
    return proto3.util.equals(ReportErrorsResponse, a, b)
  }
}

/**
 * @generated from message depot.cloud.v2.ReportHealthRequest
 */
export class ReportHealthRequest extends Message<ReportHealthRequest> {
  /**
   * @generated from field: string connection_id = 1;
   */
  connectionId = ''

  constructor(data?: PartialMessage<ReportHealthRequest>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'depot.cloud.v2.ReportHealthRequest'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    {no: 1, name: 'connection_id', kind: 'scalar', T: 9 /* ScalarType.STRING */},
  ])

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ReportHealthRequest {
    return new ReportHealthRequest().fromBinary(bytes, options)
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ReportHealthRequest {
    return new ReportHealthRequest().fromJson(jsonValue, options)
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ReportHealthRequest {
    return new ReportHealthRequest().fromJsonString(jsonString, options)
  }

  static equals(
    a: ReportHealthRequest | PlainMessage<ReportHealthRequest> | undefined,
    b: ReportHealthRequest | PlainMessage<ReportHealthRequest> | undefined,
  ): boolean {
    return proto3.util.equals(ReportHealthRequest, a, b)
  }
}

/**
 * @generated from message depot.cloud.v2.ReportHealthResponse
 */
export class ReportHealthResponse extends Message<ReportHealthResponse> {
  constructor(data?: PartialMessage<ReportHealthResponse>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'depot.cloud.v2.ReportHealthResponse'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [])

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ReportHealthResponse {
    return new ReportHealthResponse().fromBinary(bytes, options)
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ReportHealthResponse {
    return new ReportHealthResponse().fromJson(jsonValue, options)
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ReportHealthResponse {
    return new ReportHealthResponse().fromJsonString(jsonString, options)
  }

  static equals(
    a: ReportHealthResponse | PlainMessage<ReportHealthResponse> | undefined,
    b: ReportHealthResponse | PlainMessage<ReportHealthResponse> | undefined,
  ): boolean {
    return proto3.util.equals(ReportHealthResponse, a, b)
  }
}

/**
 * @generated from message depot.cloud.v2.GetActiveAgentVersionRequest
 */
export class GetActiveAgentVersionRequest extends Message<GetActiveAgentVersionRequest> {
  /**
   * @generated from field: string connection_id = 1;
   */
  connectionId = ''

  constructor(data?: PartialMessage<GetActiveAgentVersionRequest>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'depot.cloud.v2.GetActiveAgentVersionRequest'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    {no: 1, name: 'connection_id', kind: 'scalar', T: 9 /* ScalarType.STRING */},
  ])

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetActiveAgentVersionRequest {
    return new GetActiveAgentVersionRequest().fromBinary(bytes, options)
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetActiveAgentVersionRequest {
    return new GetActiveAgentVersionRequest().fromJson(jsonValue, options)
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetActiveAgentVersionRequest {
    return new GetActiveAgentVersionRequest().fromJsonString(jsonString, options)
  }

  static equals(
    a: GetActiveAgentVersionRequest | PlainMessage<GetActiveAgentVersionRequest> | undefined,
    b: GetActiveAgentVersionRequest | PlainMessage<GetActiveAgentVersionRequest> | undefined,
  ): boolean {
    return proto3.util.equals(GetActiveAgentVersionRequest, a, b)
  }
}

/**
 * @generated from message depot.cloud.v2.GetActiveAgentVersionResponse
 */
export class GetActiveAgentVersionResponse extends Message<GetActiveAgentVersionResponse> {
  /**
   * @generated from field: string newer_than = 1;
   */
  newerThan = ''

  /**
   * @generated from field: optional bool connection_deleted = 2;
   */
  connectionDeleted?: boolean

  constructor(data?: PartialMessage<GetActiveAgentVersionResponse>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'depot.cloud.v2.GetActiveAgentVersionResponse'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    {no: 1, name: 'newer_than', kind: 'scalar', T: 9 /* ScalarType.STRING */},
    {no: 2, name: 'connection_deleted', kind: 'scalar', T: 8 /* ScalarType.BOOL */, opt: true},
  ])

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetActiveAgentVersionResponse {
    return new GetActiveAgentVersionResponse().fromBinary(bytes, options)
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetActiveAgentVersionResponse {
    return new GetActiveAgentVersionResponse().fromJson(jsonValue, options)
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetActiveAgentVersionResponse {
    return new GetActiveAgentVersionResponse().fromJsonString(jsonString, options)
  }

  static equals(
    a: GetActiveAgentVersionResponse | PlainMessage<GetActiveAgentVersionResponse> | undefined,
    b: GetActiveAgentVersionResponse | PlainMessage<GetActiveAgentVersionResponse> | undefined,
  ): boolean {
    return proto3.util.equals(GetActiveAgentVersionResponse, a, b)
  }
}

/**
 * @generated from message depot.cloud.v2.CloudState
 */
export class CloudState extends Message<CloudState> {
  /**
   * @generated from oneof depot.cloud.v2.CloudState.state
   */
  state:
    | {
        /**
         * @generated from field: depot.cloud.v2.CloudState.Aws aws = 1;
         */
        value: CloudState_Aws
        case: 'aws'
      }
    | {case: undefined; value?: undefined} = {case: undefined}

  constructor(data?: PartialMessage<CloudState>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'depot.cloud.v2.CloudState'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    {no: 1, name: 'aws', kind: 'message', T: CloudState_Aws, oneof: 'state'},
  ])

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CloudState {
    return new CloudState().fromBinary(bytes, options)
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CloudState {
    return new CloudState().fromJson(jsonValue, options)
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CloudState {
    return new CloudState().fromJsonString(jsonString, options)
  }

  static equals(
    a: CloudState | PlainMessage<CloudState> | undefined,
    b: CloudState | PlainMessage<CloudState> | undefined,
  ): boolean {
    return proto3.util.equals(CloudState, a, b)
  }
}

/**
 * @generated from message depot.cloud.v2.CloudState.Aws
 */
export class CloudState_Aws extends Message<CloudState_Aws> {
  /**
   * @generated from field: string availability_zone = 1;
   */
  availabilityZone = ''

  /**
   * @generated from field: string state = 2;
   */
  state = ''

  constructor(data?: PartialMessage<CloudState_Aws>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'depot.cloud.v2.CloudState.Aws'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    {no: 1, name: 'availability_zone', kind: 'scalar', T: 9 /* ScalarType.STRING */},
    {no: 2, name: 'state', kind: 'scalar', T: 9 /* ScalarType.STRING */},
  ])

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CloudState_Aws {
    return new CloudState_Aws().fromBinary(bytes, options)
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CloudState_Aws {
    return new CloudState_Aws().fromJson(jsonValue, options)
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CloudState_Aws {
    return new CloudState_Aws().fromJsonString(jsonString, options)
  }

  static equals(
    a: CloudState_Aws | PlainMessage<CloudState_Aws> | undefined,
    b: CloudState_Aws | PlainMessage<CloudState_Aws> | undefined,
  ): boolean {
    return proto3.util.equals(CloudState_Aws, a, b)
  }
}

/**
 * @generated from message depot.cloud.v2.CloudStatePatch
 */
export class CloudStatePatch extends Message<CloudStatePatch> {
  /**
   * @generated from field: int32 generation = 1;
   */
  generation = 0

  /**
   * @generated from oneof depot.cloud.v2.CloudStatePatch.patch
   */
  patch:
    | {
        /**
         * @generated from field: depot.cloud.v2.CloudStatePatch.Aws aws = 2;
         */
        value: CloudStatePatch_Aws
        case: 'aws'
      }
    | {case: undefined; value?: undefined} = {case: undefined}

  constructor(data?: PartialMessage<CloudStatePatch>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'depot.cloud.v2.CloudStatePatch'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    {no: 1, name: 'generation', kind: 'scalar', T: 5 /* ScalarType.INT32 */},
    {no: 2, name: 'aws', kind: 'message', T: CloudStatePatch_Aws, oneof: 'patch'},
  ])

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CloudStatePatch {
    return new CloudStatePatch().fromBinary(bytes, options)
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CloudStatePatch {
    return new CloudStatePatch().fromJson(jsonValue, options)
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CloudStatePatch {
    return new CloudStatePatch().fromJsonString(jsonString, options)
  }

  static equals(
    a: CloudStatePatch | PlainMessage<CloudStatePatch> | undefined,
    b: CloudStatePatch | PlainMessage<CloudStatePatch> | undefined,
  ): boolean {
    return proto3.util.equals(CloudStatePatch, a, b)
  }
}

/**
 * @generated from message depot.cloud.v2.CloudStatePatch.Aws
 */
export class CloudStatePatch_Aws extends Message<CloudStatePatch_Aws> {
  /**
   * @generated from field: string patch = 1;
   */
  patch = ''

  constructor(data?: PartialMessage<CloudStatePatch_Aws>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'depot.cloud.v2.CloudStatePatch.Aws'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    {no: 1, name: 'patch', kind: 'scalar', T: 9 /* ScalarType.STRING */},
  ])

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CloudStatePatch_Aws {
    return new CloudStatePatch_Aws().fromBinary(bytes, options)
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CloudStatePatch_Aws {
    return new CloudStatePatch_Aws().fromJson(jsonValue, options)
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CloudStatePatch_Aws {
    return new CloudStatePatch_Aws().fromJsonString(jsonString, options)
  }

  static equals(
    a: CloudStatePatch_Aws | PlainMessage<CloudStatePatch_Aws> | undefined,
    b: CloudStatePatch_Aws | PlainMessage<CloudStatePatch_Aws> | undefined,
  ): boolean {
    return proto3.util.equals(CloudStatePatch_Aws, a, b)
  }
}
