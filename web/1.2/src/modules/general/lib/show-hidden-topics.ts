import type { AppContext } from '@src/types'
import { displayingHiddenTopicsSet } from '../state'

export function showHiddenTopics(cn: AppContext, show: boolean) {
  cn.dispatch(displayingHiddenTopicsSet(show))
}
