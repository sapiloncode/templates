import type { AppContext } from '@src/types'
import { isMobileSet } from '../state'

export function toggleIsMobile(cn: AppContext) {
  const {
    general: { isMobile },
  } = cn.getState()
  cn.dispatch(isMobileSet(!isMobile))
}
