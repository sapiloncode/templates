import { AppContext } from '@src/types'
import { widgetsSet } from '../state'
import { CloseWidgetMode } from '../types'
import { getCurrentColumn } from './get-current-column'
import { setIsDirty } from './set-is-dirty'

export async function closeWidget(cn: AppContext, mode: CloseWidgetMode = 'FromCurrent') {
  const {
    general: { columns },
  } = cn.getState()

  const column = getCurrentColumn(cn)
  const widgets = mode === 'FromCurrent' ? columns.slice(0, column) : columns.filter((_, index) => index !== column)

  setIsDirty(cn, false)
  cn.dispatch(widgetsSet(widgets))
}
