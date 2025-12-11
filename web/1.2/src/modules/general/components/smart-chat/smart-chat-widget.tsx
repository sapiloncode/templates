import { WidgetComponent } from '@src/components'
import { useAppSelector } from '@src/hooks'
import type { WidgetComponentProps } from '@src/modules'
import { markdown2Html } from '@src/utils'
import { FC } from 'react'

type Props = unknown

export type SmartChatWidgetSchema = Props & WidgetComponentProps<Props>

export const SmartChatWidget: FC<SmartChatWidgetSchema> = ({ cn, ...props }) => {
  const { smartPanel: panel } = useAppSelector((state) => state.general)

  return (
    <WidgetComponent cn={cn} {...props} fullHeight>
      <div className="bg-gray-300 px-4 pb-4 pt-0 overflow-auto flex flex-col gap-2">
        {panel.messages.map((message) => (
          <div
            className="bg-green-800 text-white p-8 rounded-lg max-w-[400px] [&_ul]:list-disc [&_ul]:px-4"
            key={message.timestamp}
            dangerouslySetInnerHTML={{ __html: markdown2Html(message.content) }}
          />
        ))}
      </div>
    </WidgetComponent>
  )
}
