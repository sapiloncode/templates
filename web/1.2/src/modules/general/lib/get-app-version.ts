import { apiCall } from '@src/utils'

export async function getAppVersion() {
  return await apiCall<string>('/version')
}
