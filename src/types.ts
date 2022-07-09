export interface StateResponse {
  autoscalingGroups: AutoscalingGroupState[]
  terminate: string[]
}

export interface AutoscalingGroupState {
  name: string
  max: number
  desired: number
}
