import { Button, DropdownMenu, Icon, IconButton } from '@src/components'
import { useAppSelector } from '@src/hooks'
import { navigate, WidgetAction } from '@src/modules'
import type { AppContext, ID, ListItem } from '@src/types'
import cs from 'classnames'
import Hammer from 'hammerjs'
import { Checkbox } from 'radix-ui'
import { FC, useEffect, useMemo, useRef, useState } from 'react'

type Props = {
  selectedItems?: ID[]
  cn: AppContext
  actions?: WidgetAction[]
  item: ListItem<unknown>
  selectable?: boolean
  activeItem: ID
  onSelectItem: (item: ListItem<unknown>) => void
  onSelectChange: (cn: AppContext, selectedItems: ID[]) => void
}

const SWIPE_ACTION_MIN_WIDTH = 150
const HORIZONTAL_SWIPE_VALID_DELTA_Y_THRESHOLD = 20

export const ListWidgetItem: FC<Props> = ({
  selectedItems,
  cn,
  actions,
  activeItem,
  item,
  selectable,
  onSelectItem,
  onSelectChange,
}) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const [swipeDistance, setSwipeDistance] = useState(0)
  const swipeActionLeft = useMemo(() => actions?.find((action) => action.modifiers?.includes('swipe-left')), [actions])
  const swipeActionRight = useMemo(
    () => actions?.find((action) => action.modifiers?.includes('swipe-right')),
    [actions]
  )
  const isMobile = useAppSelector((state) => state.general.isMobile)

  useEffect(() => {
    if (!isMobile) {
      return
    }

    // Initialize Hammer.js on the ref element
    const hammer = new Hammer(elementRef.current)

    // Define swipe event handler to track swipe distance
    const handleSwipe = (event: HammerInput) => {
      switch (event.direction) {
        case Hammer.DIRECTION_LEFT:
          if (event.deltaX > 0) {
            setSwipeDistance(0) // Update state with negative deltaX for swipe right
          }
          if (Math.abs(event.deltaY) < HORIZONTAL_SWIPE_VALID_DELTA_Y_THRESHOLD && event.deltaX < -50) {
            setSwipeDistance(event.deltaX) // Update state with negative deltaX for swipe left
          }
          break

        case Hammer.DIRECTION_RIGHT:
          if (event.deltaX < 0) {
            setSwipeDistance(0) // Update state with negative deltaX for swipe left
          }
          if (Math.abs(event.deltaY) < HORIZONTAL_SWIPE_VALID_DELTA_Y_THRESHOLD && event.deltaX > 50) {
            setSwipeDistance(event.deltaX) // Update state with negative deltaX for swipe left
          }
          break
      }
    }

    // Reset the swipe distance when the pan ends
    const handlePanEnd = (event: HammerInput) => {
      if (event.deltaX < -SWIPE_ACTION_MIN_WIDTH) {
        swipeActionLeft?.handler(cn, item)
      } else if (event.deltaX > SWIPE_ACTION_MIN_WIDTH) {
        swipeActionRight?.handler(cn, item)
      }
      setSwipeDistance(0) // Reset distance when swipe ends
    }

    // Set the swipe direction to horizontal only
    hammer.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL })

    // Add swipe event listeners
    hammer.on('pan', handleSwipe)
    hammer.on('panend', handlePanEnd)

    // Cleanup event listeners on component unmount
    return () => {
      hammer.off('pan', handleSwipe)
      hammer.off('panend', handlePanEnd)
      hammer.destroy()
    }
  }, [cn, item, swipeActionLeft, swipeActionRight, isMobile])

  function toggleSelect(id: ID): void {
    const newSelection = selectedItems.includes(id)
      ? selectedItems.filter((item) => item !== id)
      : [...selectedItems, id]

    onSelectChange(cn, newSelection)
  }

  function getItemActions(): WidgetAction[] {
    if (!actions) {
      return []
    }
    return actions
      .filter((action) => (item.actions ?? []).includes(action.name))
      .filter((action) => !action.modifiers?.includes('overflow'))
  }

  function getMoreActions(): WidgetAction[] {
    if (!actions) {
      return []
    }
    return actions
      .filter((action) => (item.actions ?? []).includes(action.name))
      .filter((action) => action.modifiers?.includes('overflow'))
  }

  function handleClick(): void {
    if (isExternalLink()) {
      return
    } else if (item.handler) {
      item.handler(cn)
    } else if (item.href) {
      onSelectItem(item)
      navigate(cn, item.href)
    } else {
      onSelectItem(item)
    }
  }

  function isActive(id: ID): boolean {
    return selectable ? selectedItems.includes(id) : activeItem === id
  }

  function isExternalLink() {
    return /^https?:/i.test(item.href)
  }

  const moreActions = getMoreActions()

  function getItemAttributes() {
    if (!item.attrs) return {}

    return Object.entries(item.attrs).reduce(
      (acc, [key, value]) => {
        if (typeof value === 'boolean') {
          if (value) acc[key] = '' // boolean true → present with empty string
        } else {
          acc[key] = String(value) // string or number → normal attribute
        }
        return acc
      },
      {} as Record<string, string>
    )
  }

  return (
    <div
      ref={elementRef}
      className="list-widget-item relative overflow-hidden"
      data-item-id={String(item.id)}
      {...getItemAttributes()}
    >
      {isMobile && swipeActionRight && swipeDistance >= 0 && (
        <div
          className="swipe-right absolute top-0 bottom-0 right-0 flex items-center justify-center transition-[width] duration-200 ease-out overflow-hidden bg-neutral-400 text-white gap-[5px]"
          style={{ width: swipeDistance > SWIPE_ACTION_MIN_WIDTH ? '100%' : `${swipeDistance}px` }}
        >
          <IconButton
            className={cs('btn-sm', { 'group-hover': false })}
            icon={swipeActionRight.icon}
            title={swipeActionRight.label}
          />
        </div>
      )}

      <div
        onClick={() => handleClick()}
        className={cs({
          'group bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 flex flex-1 gap-2 cursor-pointer text-gray-600 dark:text-neutral-100 items-center px-4 h-12 max-[600px]:h-16 min-[600px]:hover:bg-gray-50 min-[600px]:dark:hover:bg-neutral-800 max-[600px]:active:bg-amber-50 max-[600px]:dark:active:bg-neutral-800': true,
          'disabled:bg-inherit disabled:text-gray-400 disabled:text-sm disabled:border-b-0': item.disabled,
          '!bg-amber-100 dark:!bg-neutral-500': isActive(item.id),
        })}
      >
        {/* Icon */}
        {item.image ? (
          <img src={item.image} alt={item.title} className="w-8 min-w-8 h-8 rounded-full object-cover" />
        ) : (
          <Icon className={cs('icon-image', item.iconCss)} icon={item.icon ?? ''} />
        )}

        {/* Caption */}
        <div className="item-caption flex flex-col justify-between items-left flex-1 overflow-hidden font-medium">
          <div className="flex flex-grow items-center justify-left nowrap gap-2">
            {/* Title */}
            {isExternalLink() ? (
              <a
                className="item-title whitespace-nowrap overflow-hidden text-ellipsis w-full"
                href={item.href}
                target="_blank"
              >
                {item.title}
              </a>
            ) : (
              <span className="item-title whitespace-nowrap overflow-hidden text-ellipsis">{item.title}</span>
            )}

            {/* Tags */}
            <div className="item-tags flex gap-[2px] flex-row items-center">
              {item.itemTags?.map((tag, index) => (
                <div
                  key={index}
                  className="flex flex-row items-center bg-gray-200 text-gray-700 px-1 text-sm rounded font-medium"
                >
                  <Icon icon={tag.icon} />
                  <span>{tag.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subtitle */}
          <span className="item-subtitle whitespace-nowrap overflow-hidden text-xs leading-none text-gray-400 font-medium">
            {item.subtitle}
          </span>
        </div>

        {/* Item Actions */}
        <div className="flex flex-row items-center">
          {getItemActions().map((action, index) =>
            action.icon ? (
              <IconButton
                key={index}
                className={cs('btn-sm', { 'group-hover': false })}
                data-name={action.name}
                icon={action.icon}
                title={action.label}
                onClick={(ev) => {
                  ev.stopPropagation()
                  action.handler(cn, item)
                }}
              />
            ) : (
              <Button
                key={index}
                className={cs('btn-sm', { 'group-hover': false })}
                data-name={action.name}
                onClick={(ev) => {
                  ev.stopPropagation()
                  action.handler(cn, item)
                }}
              >
                {action.label}
              </Button>
            )
          )}

          {/* More Actions */}
          {moreActions.length > 0 && (
            <DropdownMenu menuItems={moreActions} onSelectItem={(item) => item.handler?.(cn)}>
              <IconButton
                className={cs({ 'group-hover-visible': true })}
                icon="more_horiz"
                data-name="more"
                title="More"
              />
            </DropdownMenu>
          )}
        </div>

        {/* Selectable */}
        {selectable && (
          <Checkbox.Root className="CheckboxRoot" defaultChecked onClick={() => toggleSelect(item.id)}>
            <Checkbox.Indicator className="CheckboxIndicator">
              {selectedItems.includes(item.id) ? (
                <Icon icon="select_check_box" />
              ) : (
                <Icon icon="check_box_outline_blank" />
              )}
            </Checkbox.Indicator>
          </Checkbox.Root>
        )}
      </div>

      {isMobile && swipeActionLeft && swipeDistance <= 0 && (
        <div
          className="swipe-left absolute top-0 bottom-0 left-0 flex items-center justify-center transition-[width] duration-200 ease-out overflow-hidden bg-neutral-400 text-white gap-[5px]"
          style={{ width: -swipeDistance > SWIPE_ACTION_MIN_WIDTH ? '100%' : `${-swipeDistance}px` }}
        >
          <IconButton
            className={cs('btn-sm', { 'group-hover': false })}
            icon={swipeActionLeft.icon}
            title={swipeActionLeft.label}
          />
        </div>
      )}
    </div>
  )
}
