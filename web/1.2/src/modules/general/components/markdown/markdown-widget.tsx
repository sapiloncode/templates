import type { WidgetComponentProps } from '@src/modules'
import { markdown2Html } from '@src/utils'
import cs from 'classnames'
import { FC } from 'react'

type Props = {
  content: string
}

export type MarkdownWidgetSchema = WidgetComponentProps<Props> & Props

export const MarkdownWidget: FC<MarkdownWidgetSchema> = ({ content, name }) => {
  if (!content) return null
  const html = markdown2Html(content)
  return (
    <div className={cs('widget widget-markdown')} data-name={name} dangerouslySetInnerHTML={{ __html: html }}></div>
  )
}
