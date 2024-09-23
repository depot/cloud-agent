// @generated by protoc-gen-connect-es v1.4.0 with parameter "target=ts,import_extension=none"
// @generated from file depot/cloud/v5/cloud.proto (package depot.cloud.v5, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import {MethodKind} from '@bufbuild/protobuf'
import {
  GetActiveAgentVersionRequest,
  GetActiveAgentVersionResponse,
  GetDesiredStateRequest,
  GetDesiredStateResponse,
  ReconcileVolumesRequest,
  ReconcileVolumesResponse,
  ReplaceVolumeRequest,
  ReplaceVolumeResponse,
  ReportErrorsRequest,
  ReportErrorsResponse,
  ReportVolumeUpdatesRequest,
  ReportVolumeUpdatesResponse,
} from './cloud_pb'

/**
 * @generated from service depot.cloud.v5.CloudService
 */
export const CloudService = {
  typeName: 'depot.cloud.v5.CloudService',
  methods: {
    /**
     * @generated from rpc depot.cloud.v5.CloudService.GetDesiredState
     */
    getDesiredState: {
      name: 'GetDesiredState',
      I: GetDesiredStateRequest,
      O: GetDesiredStateResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc depot.cloud.v5.CloudService.ReportErrors
     */
    reportErrors: {
      name: 'ReportErrors',
      I: ReportErrorsRequest,
      O: ReportErrorsResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc depot.cloud.v5.CloudService.GetActiveAgentVersion
     */
    getActiveAgentVersion: {
      name: 'GetActiveAgentVersion',
      I: GetActiveAgentVersionRequest,
      O: GetActiveAgentVersionResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc depot.cloud.v5.CloudService.ReconcileVolumes
     */
    reconcileVolumes: {
      name: 'ReconcileVolumes',
      I: ReconcileVolumesRequest,
      O: ReconcileVolumesResponse,
      kind: MethodKind.ServerStreaming,
    },
    /**
     * @generated from rpc depot.cloud.v5.CloudService.ReportVolumeUpdates
     */
    reportVolumeUpdates: {
      name: 'ReportVolumeUpdates',
      I: ReportVolumeUpdatesRequest,
      O: ReportVolumeUpdatesResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc depot.cloud.v5.CloudService.ReplaceVolume
     */
    replaceVolume: {
      name: 'ReplaceVolume',
      I: ReplaceVolumeRequest,
      O: ReplaceVolumeResponse,
      kind: MethodKind.Unary,
    },
  },
} as const