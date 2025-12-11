import type { AppContext } from '@src/types'
import { defaultWidgetPathSet } from '../state'

export function setDefaultWidgetPath(cn: AppContext, path: string) {
  cn.dispatch(defaultWidgetPathSet(path))
}
