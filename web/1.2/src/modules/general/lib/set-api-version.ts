import type { AppContext } from '@src/types'
import { apiVersionSet } from '../state'

export function setApiVersion(cn: AppContext, fullVersion: string) {
  const [apiVersion] = fullVersion.split(' ')
  cn.dispatch(apiVersionSet(apiVersion))
}
