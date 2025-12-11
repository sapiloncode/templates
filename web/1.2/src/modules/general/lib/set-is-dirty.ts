import { AppContext } from '@src/types'
import { isDirtySet } from '../state'

export function setIsDirty(cn: AppContext, dirty: boolean) {
  const {
    general: { isDirty },
  } = cn.getState()

  if (isDirty !== dirty) {
    cn.dispatch(isDirtySet(dirty))
  }
}
