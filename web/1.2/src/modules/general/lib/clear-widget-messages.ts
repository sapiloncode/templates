import { AppContext } from '@src/types'
import { setWidgetState } from './set-widget-state'

export async function clearWidgetMessages(cn: AppContext) {
  setWidgetState(cn, { messages: [] })
}
