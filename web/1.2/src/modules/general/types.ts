import { Dispatch } from '@reduxjs/toolkit'
import type { AppContext } from '@src/types'
import { FC, ReactNode } from 'react'

export class InternalAppContext<RootState> {
  constructor(
    dispatch: Dispatch,
    getState: () => RootState,
    href: string,
    pathname: string,
    query: Record<string, string>,
    widgetName: string
  ) {
    this.dispatch = dispatch
    this.getState = getState
    this.href = href
    this.pathname = pathname
    this.query = query
    this.widgetName = widgetName
  }

  dispatch: Dispatch
  getState: () => RootState

  /**
   * e.g. /topics?id=1
   */
  href: string

  /**
   * e.g. /topics
   */
  pathname: string

  /**
   * e.g. { id:1 }
   */
  query: Record<string, string>

  /**
   * widgetPathName and pathname are the same in most cases excluding when we have multiple rows in a column
   */
  widgetName?: string
}

export type WidgetWidth = 'sm' | 'md' | 'lg' | 'full'

export type DialogMessageType = 'error' | 'warning' | 'info' | 'success' | 'question'
export type WidgetMessage = {
  text: string
  type: DialogMessageType
}

export type WidgetComponentProps<W = unknown> = {
  /**
   * Required widget name. Must be unique.
   */
  name: string

  /**
   * App context. Must be passed to the widget through useWidget hook.
   */
  cn?: AppContext
  title?: string
  widgetType: FC
  widgetHook?: (props: W) => W

  /**
   * width or maximum size of a widget. The default is 'sm'.
   */
  width?: WidgetWidth
  minWidth?: WidgetWidth
  fullHeight?: boolean
  header?: WidgetHeaderItem[]
  messages?: WidgetMessage[]
}

/**
 * before-title: to make the widget item before the title
 * after-title: to make the widget item after the title
 */
export type WidgetModifier =
  | 'overflow'
  | 'swipe-right'
  | 'swipe-left'
  | 'before-title'
  | 'after-title'
  | 'mobile'
  | 'hover-visible'
  | 'hidden'

export type WidgetAction = {
  /**
   * Actions will be referenced by their name
   */
  name?: string
  label?: string
  tooltip?: string
  icon?: string // from material-symbols-outlined

  // Widgets name
  href?: string

  items?: WidgetAction[]
  image?: string
  mode?: 'modal'
  widget?: string
  modifiers?: WidgetModifier[]

  custom?: (cn: AppContext, params?: { css?: string }) => ReactNode
  handler?: (cn: AppContext, ...args: unknown[]) => Promise<void>
}

export type WidgetHeaderItem = {
  /**
   * Actions will be referenced by their name
   */
  name?: string
  label?: string
  tooltip?: string
  icon?: string // from material-symbols-outlined

  // Widgets name
  href?: string

  items?: WidgetAction[]
  image?: string
  mode?: 'modal'
  widget?: string
  modifiers?: WidgetModifier[]

  custom?: (cn: AppContext, params?: { css?: string }) => ReactNode
  handler?: (cn: AppContext, ...args: unknown[]) => Promise<void>
}

export type LinkItem = {
  label?: string
  name?: string
  icon?: string
  image?: string

  url?: string
  handler?: (cn: AppContext) => void
}

export type WidgetProps = {
  cn: AppContext
}

export type WidgetColumn = {
  href: string
  pathname: string
  query: Record<string, string>
  search: string
}

export type CloseWidgetMode = 'FromCurrent' | 'CurrentOnly'
