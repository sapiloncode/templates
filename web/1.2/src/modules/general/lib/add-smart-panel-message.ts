import type { AppContext } from '@src/types'
import { type SmartMessage, smartPanelMessageAdded } from '../state'

export function addSmartPanelMessage(cn: AppContext, message: SmartMessage) {
  cn.dispatch(smartPanelMessageAdded(message))
}
