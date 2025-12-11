import type { WidgetComponentProps } from '@src/modules'
import { assert } from '@src/utils'
import { FC } from 'react'

export const WithHookWidget: FC<WidgetComponentProps> = (schema) => {
  const props = schema.widgetHook(schema) as WidgetComponentProps
  if (!props) {
    return null // happens when a topic is removed (by removing the sharing)
  }
  assert(props.cn, 'App context is not passed in the widgetHook!')
  const WidgetComponent = schema.widgetType as FC<WidgetComponentProps>
  return <WidgetComponent {...props} />
}
