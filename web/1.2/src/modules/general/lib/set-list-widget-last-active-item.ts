import { STORAGE_KEY_LIST_WIDGET_ACTIVE_ITEMS } from '@src/constants'
import { AppContext, ID } from '@src/types'
import { localStorageWrite } from '@src/utils'

export function setListWidgetLastActiveItem(cn: AppContext, id: ID) {
  const savedActiveItems: Record<string, unknown> = JSON.parse(
    localStorage.getItem(STORAGE_KEY_LIST_WIDGET_ACTIVE_ITEMS) ?? '{}'
  )
  savedActiveItems[cn.href] = id

  localStorageWrite(STORAGE_KEY_LIST_WIDGET_ACTIVE_ITEMS, JSON.stringify(savedActiveItems))
}
