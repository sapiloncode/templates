import { STORAGE_KEY_LIST_WIDGET_ACTIVE_ITEMS } from '@src/constants'
import { AppContext } from '@src/types'

export function getListWidgetLastActiveItem(cn: AppContext) {
  const savedActiveItems: Record<string, unknown> = JSON.parse(
    localStorage.getItem(STORAGE_KEY_LIST_WIDGET_ACTIVE_ITEMS) ?? '{}'
  )
  return savedActiveItems[cn.href]
}
