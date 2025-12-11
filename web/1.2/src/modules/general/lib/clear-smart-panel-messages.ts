import type { AppContext } from '@src/types'
import { smartPanelMessagesCleared } from '../state'

export function clearSmartPanelMessages(cn: AppContext) {
  cn.dispatch(smartPanelMessagesCleared())
}
