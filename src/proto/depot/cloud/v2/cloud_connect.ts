// @generated by protoc-gen-connect-es v0.10.0 with parameter "target=ts,import_extension=none"
// @generated from file depot/cloud/v2/cloud.proto (package depot.cloud.v2, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import {MethodKind} from '@bufbuild/protobuf'
import {
  GetActiveAgentVersionRequest,
  GetActiveAgentVersionResponse,
  GetDesiredStateRequest,
  GetDesiredStateResponse,
  ReportCurrentStateRequest,
  ReportCurrentStateResponse,
  ReportErrorsRequest,
  ReportErrorsResponse,
  ReportHealthRequest,
  ReportHealthResponse,
} from './cloud_pb'

/**
 * @generated from service depot.cloud.v2.CloudService
 */
export const CloudService = {
  typeName: 'depot.cloud.v2.CloudService',
  methods: {
    /**
     * @generated from rpc depot.cloud.v2.CloudService.GetDesiredState
     */
    getDesiredState: {
      name: 'GetDesiredState',
      I: GetDesiredStateRequest,
      O: GetDesiredStateResponse,
      kind: MethodKind.ServerStreaming,
    },
    /**
     * @generated from rpc depot.cloud.v2.CloudService.ReportCurrentState
     */
    reportCurrentState: {
      name: 'ReportCurrentState',
      I: ReportCurrentStateRequest,
      O: ReportCurrentStateResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc depot.cloud.v2.CloudService.ReportErrors
     */
    reportErrors: {
      name: 'ReportErrors',
      I: ReportErrorsRequest,
      O: ReportErrorsResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc depot.cloud.v2.CloudService.ReportHealth
     */
    reportHealth: {
      name: 'ReportHealth',
      I: ReportHealthRequest,
      O: ReportHealthResponse,
      kind: MethodKind.ClientStreaming,
    },
    /**
     * @generated from rpc depot.cloud.v2.CloudService.GetActiveAgentVersion
     */
    getActiveAgentVersion: {
      name: 'GetActiveAgentVersion',
      I: GetActiveAgentVersionRequest,
      O: GetActiveAgentVersionResponse,
      kind: MethodKind.Unary,
    },
  },
} as const
