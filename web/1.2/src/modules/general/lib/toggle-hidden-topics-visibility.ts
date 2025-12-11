import type { AppContext } from '@src/types'
import { displayingHiddenTopicsSet } from '../state'

export function toggleHiddenTopicsVisibility(cn: AppContext) {
  const {
    general: {
      calendar: { displayingHiddenTopics },
    },
  } = cn.getState()
  cn.dispatch(displayingHiddenTopicsSet(!displayingHiddenTopics))
}
