import type { WidgetComponentProps } from '@src/modules'
import { FC } from 'react'

export const WithoutHookWidget: FC<WidgetComponentProps> = (schema) => {
  const WidgetComponent = schema.widgetType as FC<WidgetComponentProps>
  return <WidgetComponent {...schema} />
}
