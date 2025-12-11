import { AppContext, NavigatePlacement } from '@src/types'
import { trimSlash } from '@src/utils'
import queryString from 'query-string'
import { widgetsSet } from '../state'
import type { WidgetColumn } from '../types'
import { getCurrentColumn } from './get-current-column'
import { getNavigatePlacement } from './get-navigate-placement'

export function navigate(cn: AppContext, target: string, placement?: NavigatePlacement) {
  if (/^https?:/i.test(target)) {
    return window.open(target, '_blank')
  }

  if (!cn) throw new Error('general.service.navigate AppContext is required')

  const {
    general: { isDirty, columns },
  } = cn.getState()

  if (isDirty) {
    alert('You have unsaved changes. Please save your work before navigating away.')
    return
  }

  let widgets: WidgetColumn[]
  placement = placement ?? getNavigatePlacement(target)
  const targets = trimSlash(target.split('#')[0]).split('/')
  const columnIndex = getCurrentColumn(cn)

  switch (placement) {
    case 'first': {
      widgets = []
      const path = targets.map((p) => trimSlash(p)).join('/')
      history.replaceState({ path }, '', path)
      break
    }

    case 'close':
    case 'replace':
      widgets = columns.slice(0, columnIndex)
      break

    case 'next':
      widgets = columns.slice(0, columnIndex + 1)
      break

    default:
      widgets = [...columns]
      break
  }

  if (placement !== 'close') {
    for (const href of targets) {
      const [pathname, search] = trimSlash(href).split('?')

      const column: WidgetColumn = {
        href,
        pathname,
        query: queryString.parse(search) as Record<string, string>,
        search: search ? '?' + search : '',
      }
      widgets.push(column)
    }
  }

  cn.dispatch(widgetsSet(widgets))
}
