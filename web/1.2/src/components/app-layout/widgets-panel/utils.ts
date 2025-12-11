import type { WidgetComponentProps } from '@src/modules'
import { trimSlash } from '@src/utils'

export function getWidgetRouter(
  widgetSchemas: WidgetComponentProps[],
  compositeWidgets: Record<string, WidgetComponentProps[]>
) {
  const widgetRouter: Record<string, WidgetComponentProps[]> = { ...compositeWidgets }
  const path = trimSlash(location.pathname)

  if (path && !widgetSchemas.some((schema) => schema.name === path)) {
    location.href = '/'
    return
  }

  widgetSchemas.forEach((widget) => {
    Object.freeze(widget)
    widgetRouter[widget.name] = [widget]
  })

  return widgetRouter
}
