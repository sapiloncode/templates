import type { AppContext } from '@src/types'
import { isNavHiddenSet } from '../state'

export function hideNavbarInMobile(cn: AppContext, hide: boolean) {
  const {
    general: { isMobile },
  } = cn.getState()

  if (isMobile) {
    cn.dispatch(isNavHiddenSet(hide))
  }
}
