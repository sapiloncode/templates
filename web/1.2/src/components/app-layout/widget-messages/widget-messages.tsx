import { Icon, IconButton } from '@src/components'
import { setWidgetState, WidgetMessage } from '@src/modules'
import type { AppContext } from '@src/types'
import { markdown2Html } from '@src/utils'
import cs from 'classnames'
import { FC } from 'react'

type Props = {
  cn: AppContext
  messages: WidgetMessage[]
}

export const WidgetMessages: FC<Props> = ({ cn, messages }) => {
  if (!messages?.length) return null

  function hideMessage(message: WidgetMessage) {
    const newMessages = messages.filter((msg) => message != msg)
    setWidgetState(cn, { messages: newMessages })
  }

  const icons = { question: 'help', info: 'info', success: 'check_circle', error: 'error', warning: 'warning' }

  const messageColors = {
    error: 'bg-red-500',
    warning: 'bg-orange-600',
    question: 'bg-orange-600',
    info: 'bg-blue-500',
    success: 'bg-green-500',
  }

  return (
    <div className="flex flex-col">
      {messages.map((message, index) => (
        <div
          key={index}
          className={cs(
            'widget-message flex justify-start items-center p-2 border-b border-white text-white text-sm font-semibold gap-2',
            'widget-message_' + message.type,
            messageColors[message.type] || 'bg-gray-700'
          )}
        >
          <Icon icon={icons[message.type]} className="text-[22px]" />
          <div dangerouslySetInnerHTML={{ __html: markdown2Html(message.text) }}></div>

          <div className="flex-grow" />
          <IconButton icon="close" onClick={() => hideMessage(message)} />
        </div>
      ))}
    </div>
  )
}
