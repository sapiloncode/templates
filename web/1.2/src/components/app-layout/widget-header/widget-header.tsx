import { DropdownMenu, Icon, IconButton } from '@src/components'
import type { WidgetAction, WidgetComponentProps } from '@src/modules'
import { closeWidget, getCurrentColumn, navigate, processUrlTemplate } from '@src/modules'
import type { AppContext, WidgetMenuItem } from '@src/types'
import { assert } from '@src/utils'
import cs from 'classnames'
import { FC, useRef } from 'react'

export const WidgetHeader: FC<WidgetComponentProps> = ({ cn, title, header }) => {
  assert(cn, 'WidgetHeader: cn is required')
  const headerRef = useRef<HTMLDivElement | null>(null)

  if (!header) {
    return null
  }

  function showWidgetCloseButton() {
    return getCurrentColumn(cn) > 0
  }

  async function handleAction(action: { url?: string; handler?: (cn: AppContext) => Promise<void> }) {
    if (action.url) {
      const url = processUrlTemplate(cn, action.url)
      navigate(cn, url)
    } else {
      await action.handler?.(cn)
    }
  }

  function getItemCss(item: WidgetAction) {
    let css = ''
    if (item.modifiers?.includes('after-title')) {
      css += ' flex-grow justify-start!'
    }
    if (item.modifiers?.includes('hover-visible')) {
      css += ' group-hover-visible'
    }
    return css
  }

  function getVisibleActions() {
    const actions = header
      .filter((item) => !item.modifiers?.includes('overflow'))
      .map((item) => ({
        ...item,
        isTitle: false,
        css: getItemCss(item),
      }))

    // find the last index of an item with 'before-title' modifier
    const index = actions.findLastIndex((item) => item.modifiers?.includes('before-title'))
    const titleShouldGrow = !actions.some((item) => item.modifiers?.includes('after-title'))

    actions.splice(index + 1, 0, {
      label: title,
      isTitle: true,
      css: titleShouldGrow ? 'flex-grow' : '',
    })

    return actions
  }

  const visibleActions = getVisibleActions()

  const moreActions: WidgetMenuItem[] = header
    .filter((item) => item.modifiers?.includes('overflow'))
    .map(
      (item) =>
        ({
          name: item.name,
          label: item.label,
          icon: item.icon,
          css: getItemCss(item),
          handler: () => handleAction({ handler: (cn: AppContext) => item.handler?.(cn), url: item.href }),
        }) satisfies WidgetMenuItem
    )
  const isButton = (element: WidgetAction) => !!element.handler || !!element.href

  return (
    <div
      className="widget-header flex justify-start gap-2 items-center z-20 pr-4 pl-0.5 h-16 min-h-16 bg-neutral-100 border-b border-neutral-200 text-black sm:h-12 sm:min-h-12 sm:text-white sm:bg-neutral-800 sm:border-neutral-800"
      ref={headerRef}
    >
      {showWidgetCloseButton() && (
        <IconButton onClick={() => closeWidget(cn)} icon="arrow_back_ios_new" title="Close" />
      )}

      {/* Visible Actions */}
      {visibleActions.map((element, index) =>
        element.custom ? (
          // Custom
          <div
            data-name={element.name}
            key={index}
            className={cs('widget-element inline-flex items-center', getItemCss(element))}
            title={element.tooltip}
            onMouseDown={() => handleAction(element)}
          >
            {element.custom(cn)}
          </div>
        ) : (
          // Action
          <div
            data-name={element.name}
            key={index}
            role={isButton(element) ? 'button' : undefined}
            className={cs('widget-element flex flex-row items-center select-none', element.css, {
              'btn btn-sm': isButton(element) && !element.icon,
              'header-element_title text-xl whitespace-nowrap overflow-hidden text-ellipsis inline-flex gap-1 max-sm:font-medium first:pl-4':
                element.isTitle,
              'btn-icon btn-sm': isButton(element) && !!element.icon,
            })}
            title={element.tooltip}
            onClick={() => handleAction(element)}
          >
            <Icon icon={element.icon} />
            <span>{element.isTitle ? title : element.label}</span>
          </div>
        )
      )}

      {/* More Actions */}
      {moreActions.length > 0 && (
        <DropdownMenu menuItems={moreActions} onSelectItem={(item) => handleAction(item)}>
          <IconButton icon="more_horiz" data-name="more" title="More" />
        </DropdownMenu>
      )}
    </div>
  )
}
