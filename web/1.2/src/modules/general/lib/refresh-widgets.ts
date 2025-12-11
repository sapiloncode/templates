import { AppContext } from '@src/types'
import { widgetsSet } from '../state'

export function refreshWidgets(cn: AppContext) {
  const {
    general: { columns: widgets },
  } = cn.getState()

  cn.dispatch(widgetsSet([...widgets]))
}
