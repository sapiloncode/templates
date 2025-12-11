import type { AppContext } from '@src/types'
import type { WidgetMessage } from '../types'
import { getWidgetState } from './get-widget-state'
import { setWidgetState } from './set-widget-state'

export function showWidgetMessage(cn: AppContext, args: WidgetMessage) {
  const { messages } = getWidgetState<{ messages: WidgetMessage[] }>(cn) ?? {}
  setWidgetState(cn, { messages: messages ? [...messages, args] : [args] })
}
