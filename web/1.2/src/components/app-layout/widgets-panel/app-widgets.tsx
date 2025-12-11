import { config } from '@src/config'
import type { RootState } from '@src/core'
import { useAppSelector } from '@src/hooks'
import type { WidgetColumn, WidgetComponentProps, WidgetWidth } from '@src/modules'
import { InternalAppContext } from '@src/modules'
import type { AppContext } from '@src/types'
import { trimSlash } from '@src/utils'
import cs from 'classnames'
import { FC, useEffect, useMemo, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { Fragment } from 'react/jsx-runtime'
import { WithHookWidget } from './with-hook-widget'
import { WithoutHookWidget } from './without-hook-widget'

type Props = {
  widgetSchemas: WidgetComponentProps[]
  getAppStateHandler: () => RootState
}

export const AppWidgets: FC<Props> = ({ widgetSchemas, getAppStateHandler }) => {
  const columns = useAppSelector((state) => state.general.columns)
  const containerRef = useRef(null)
  const dispatch = useDispatch()
  const widgetRouter = useMemo(() => {
    const widgetRouter: Record<string, WidgetComponentProps[]> = {}
    const path = trimSlash(location.pathname)

    // Filter out undefined/null widgets
    const validWidgets = widgetSchemas.filter(
      (widget): widget is WidgetComponentProps =>
        widget != null && typeof widget === 'object' && typeof widget.name === 'string'
    )

    if (path && !validWidgets.some((schema) => schema.name === path)) {
      location.href = '/'
      return
    }

    validWidgets.forEach((widget) => {
      Object.freeze(widget)
      widgetRouter[widget.name] = [widget]
    })

    return widgetRouter
  }, [widgetSchemas])

  useEffect(() => {
    if (containerRef.current && columns.length > 0) {
      const scrollContainer = containerRef.current
      scrollContainer.scrollLeft = scrollContainer.scrollWidth
    }
  }, [columns])

  function GetWidget(column: WidgetColumn, widget?: WidgetComponentProps) {
    if (!widget || !widget.name) {
      return null
    }
    const internalCn = new InternalAppContext(
      dispatch,
      getAppStateHandler,
      column.href,
      column.pathname,
      column.query,
      widget.name
    )
    const cn = { ...internalCn, config } as AppContext
    return widget.widgetHook ? (
      <WithHookWidget key={widget.name} cn={cn} {...widget} />
    ) : (
      <WithoutHookWidget key={widget.name} cn={cn} {...widget} />
    )
  }

  function maxWidth(width1: WidgetWidth, width2: WidgetWidth): WidgetWidth {
    if (width1 === 'full' || width2 === 'full') return 'full'
    else if (width1 === 'lg' || width2 === 'lg') return 'lg'
    else if (width1 === 'md' || width2 === 'md') return 'md'
    return width1 ?? width2
  }

  function minWidth(width1: WidgetWidth, width2: WidgetWidth): WidgetWidth {
    if (width1 === 'md' || width2 === 'md') return 'md'
    else if (width1 === 'lg' || width2 === 'lg') return 'lg'
    else if (width1 === 'full' || width2 === 'full') return 'full'
    return width1 ?? width2
  }

  function getColumnWidthCss(column: WidgetColumn): string {
    if (!column.pathname) {
      // Happens when no default path is set
      return ''
    }

    let width: WidgetWidth = 'sm'

    if (widgetRouter?.[column.pathname]) {
      for (const widget of widgetRouter[column.pathname]) {
        width = maxWidth(width, widget.width)
      }
    }

    return width ? `widget-width-${width}` : ''
  }

  function getColumnMinWidthCss(column: WidgetColumn): string {
    if (!column.pathname) {
      // Happens when no default path is set
      return ''
    }

    if (!widgetRouter) {
      console.warn('widgetRouter is not defined, path', column.pathname)
      return ''
    }

    let width: WidgetWidth = null

    if (widgetRouter[column.pathname]) {
      for (const widget of widgetRouter[column.pathname]) {
        width = minWidth(width, widget.minWidth)
      }
    }

    return width ? `widget-min-width-${width}` : ''
  }

  return (
    <main
      ref={containerRef}
      className="flex flex-row h-full flex-1 overflow-auto sm:gap-4 sm:[scrollbar-width:thin] sm:scroll-smooth max-sm:[&>div:not(:last-of-type)]:hidden"
    >
      {columns.map((column) => (
        <div
          key={column.href}
          className={cs(
            'widget-column-container flex flex-col h-full overflow-y-auto max-sm:w-full max-sm:min-w-full sm:min-w-[var(--widget-width-sm)] [html.no-bg_&]:bg-[var(--main-surface-secondary)] [html:not(.no-bg)_&]:backdrop-blur-[10px] [html:not(.no-bg)_&]:bg-[#0002]',
            getColumnWidthCss(column),
            getColumnMinWidthCss(column)
          )}
        >
          {widgetRouter[column.pathname]?.map((schema, index) => (
            <Fragment key={index}>{GetWidget(column, schema)}</Fragment>
          ))}
        </div>
      ))}
    </main>
  )
}
