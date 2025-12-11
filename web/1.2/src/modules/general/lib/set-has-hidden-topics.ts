import type { AppContext } from '@src/types'
import { hasHiddenTopicsSet } from '../state'

export function setHasHiddenTopics(cn: AppContext, has: boolean) {
  cn.dispatch(hasHiddenTopicsSet(has))
}
