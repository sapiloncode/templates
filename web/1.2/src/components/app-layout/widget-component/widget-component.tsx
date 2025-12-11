import { useWidgetState, WidgetComponentProps, WidgetMessage } from '@src/modules'
import cs from 'classnames'
import { FC } from 'react'
import { WidgetHeader } from '../widget-header/widget-header'
import { WidgetMessages } from '../widget-messages/widget-messages'

type Props = WidgetComponentProps & {
  children: React.ReactNode
}

export const WidgetComponent: FC<Props> = ({ cn, children, ...props }) => {
  const state = useWidgetState<{ messages: WidgetMessage[] }>(cn, { messages: [] })

  return (
    <div
      className={cs('widget flex flex-col max-h-full w-full relative', {
        'h-full flex-1': props.fullHeight,
      })}
      data-name={cn.widgetName}
    >
      <WidgetHeader cn={cn} {...props} />

      <WidgetMessages cn={cn} messages={state.messages} />

      {children}
    </div>
  )
}
