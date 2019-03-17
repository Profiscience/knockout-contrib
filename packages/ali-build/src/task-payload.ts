export interface ILongRunningTaskPayload {
  status: 'ok' | 'working' | 'error'
  message?: string
  percentage?: number
  stats?: any
}
