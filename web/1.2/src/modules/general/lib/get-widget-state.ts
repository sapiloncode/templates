import { AppContext } from '@src/types'

export function getWidgetState<STATE>(cn: AppContext) {
  const {
    general: { widgetState },
  } = cn.getState()
  const state = widgetState.find(({ href }) => href === cn.href)?.state
  return state as STATE
}
