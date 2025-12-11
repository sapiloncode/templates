import { Button, Icon, IconButton, WidgetComponent } from '@src/components'
import { KEY_DONE, KEY_DOWN, KEY_ENTER, KEY_ESCAPE, KEY_GO, KEY_UP } from '@src/constants'
import { useAppSelector } from '@src/hooks'
import type { WidgetComponentProps, WidgetHeaderItem } from '@src/modules'
import {
  getListWidgetLastActiveItem,
  hideNavbarInMobile,
  setListWidgetLastActiveItem,
  wrapWidgetError,
} from '@src/modules'
import type { AppContext, ID, ListItem } from '@src/types'
import { isEmpty } from '@src/utils'
import cs from 'classnames'
import { FC, Fragment, KeyboardEvent, useEffect, useRef, useState } from 'react'
import { ListSection } from './list-section'
import { ListWidgetItem } from './list-widget-item'

type Props = {
  actions?: WidgetHeaderItem[]
  items?: ListItem<unknown>[]
  selectable?: boolean
  selectedItems?: ID[]
  defaultActiveItem?: ID
  onActivateItem?(cn: AppContext, item: ListItem<unknown>): Promise<void>
  onSelectChange?: (cn: AppContext, selectedItems: ID[]) => void
  rememberActiveItem?: boolean
  emptyListImage?: string
  emptyListMessage?: string

  /*
   * User input
   */
  showUserInput?: boolean
  userInputPlaceHolder?: string
  userInputIcon?: string
  onUserInputSubmit?: (cn: AppContext, phrase: string | null) => Promise<void>
  onUserInputChanging?: (cn: AppContext, phrase: string | null) => Promise<void>
  onUserInputAbort?: (cn: AppContext) => Promise<void>
}

export type ListWidgetSchema = Props & WidgetComponentProps<Props>

export const ListWidget: FC<ListWidgetSchema> = (prop) => {
  const {
    cn,
    selectable,
    selectedItems,
    defaultActiveItem,
    onActivateItem,
    onSelectChange,
    items,
    rememberActiveItem,
    actions,
    emptyListImage,
    emptyListMessage,

    // User Input
    showUserInput,
    userInputPlaceHolder,
    userInputIcon,
    onUserInputSubmit,
    onUserInputChanging,
    onUserInputAbort,

    ...props
  } = prop

  const [activeItem, setActiveItem] = useState<ID | null>()
  const [collapsedSections, setCollapsedSections] = useState<string[]>([])
  const [userInput, setUserInput] = useState<string>('')
  const userInputRef = useRef<HTMLInputElement | null>(null)
  const isMobile = useAppSelector((state) => state.general.isMobile)

  useEffect(() => {
    if (showUserInput) {
      userInputRef.current.focus()
    }
  }, [showUserInput])

  useEffect(() => {
    setActiveItem(defaultActiveItem)
  }, [defaultActiveItem])

  // Set active item from last session
  useEffect(() => {
    if (rememberActiveItem && !isMobile) {
      const id = getListWidgetLastActiveItem(cn)
      const item = items?.find((item) => item.id == id)
      if (item && !activeItem) {
        setActiveItem(item.id)

        wrapWidgetError(cn, async () => {
          await onActivateItem?.(cn, item)
        })
      }
    }
  }, [items, cn, rememberActiveItem, activeItem, onActivateItem, isMobile])

  function selectItem(item: ListItem<unknown>) {
    if (!item) {
      setActiveItem(null)
      return
    }
    setActiveItem(item.id)
    if (rememberActiveItem) {
      setListWidgetLastActiveItem(cn, item.id)
    }
    wrapWidgetError(cn, async () => {
      await onActivateItem?.(cn, item)
    })
  }

  function isSectionChanging(index: number): boolean {
    if (index === 0 && !items[index].section) return false
    return items[index].section != items[index - 1]?.section
  }

  function onCollapseChange(collapsed: boolean, section: string) {
    if (collapsed) {
      setCollapsedSections([...collapsedSections, section])
    } else {
      setCollapsedSections(collapsedSections.filter((s) => s !== section))
    }
  }

  async function handleUserInputKeyPress(ev: KeyboardEvent<HTMLInputElement>) {
    switch (ev.code) {
      case KEY_DONE:
      case KEY_GO:
      case KEY_ENTER:
        {
          const title = userInput
          setUserInput('')
          await onUserInputSubmit?.(cn, title)
        }
        break

      case KEY_ESCAPE:
        setUserInput('')
        onUserInputAbort?.(cn)
        break

      case KEY_DOWN:
        {
          ev.preventDefault()
          const index = activeItem ? items.findIndex((item) => item.id == activeItem) : -1
          selectItem(items[index + 1])
        }
        break

      case KEY_UP:
        {
          ev.preventDefault()
          const index = activeItem ? items.findIndex((item) => item.id == activeItem) : 0
          selectItem(index ? items[index - 1] : items[items.length - 1])
        }
        break
    }
  }

  function handleUserInputChange(value: string) {
    setUserInput(value)
    onUserInputChanging?.(cn, value)
  }

  return (
    <WidgetComponent cn={cn} {...props}>
      <div className="list-widget bg-neutral-100 dark:bg-neutral-800 pb-12 overflow-auto [html.no-bg_&]:bg-[var(--main-surface-secondary)]">
        {/* User Input */}
        <div
          className={cs({
            'text-gray-600 dark:text-neutral-200 bg-white dark:bg-neutral-800 border-b dark:border-neutral-500 flex flex-row items-center px-4 transition-[height] duration-300 overflow-hidden': true,
            'h-0 border-b-0': !showUserInput,
            'h-12 border-b md:h-12 max-[600px]:h-16': showUserInput,
          })}
        >
          {!!userInputIcon && <Icon icon={userInputIcon} />}
          <input
            className="h-full outline-none px-2 flex-1"
            onFocus={() => hideNavbarInMobile(cn, true)}
            onBlur={() => hideNavbarInMobile(cn, false)}
            ref={userInputRef}
            autoComplete="off"
            inputMode="text"
            name="list-user-input"
            value={userInput}
            placeholder={userInputPlaceHolder}
            onKeyDown={handleUserInputKeyPress}
            onChange={(ev) => handleUserInputChange(ev.target.value)}
          />

          <Button
            size="sm"
            className="inline-flex md:hidden"
            color="secondary"
            variant="solid"
            onClick={() => {
              const title = userInput
              setUserInput('')
              onUserInputSubmit?.(cn, title)
            }}
          >
            Go!
          </Button>

          <IconButton
            size="xs"
            icon="cancel"
            onClick={() => {
              setUserInput('')
              handleUserInputChange?.('')
              onUserInputAbort?.(cn)
            }}
          />
        </div>

        {/* Items */}
        {isEmpty(items) ? (
          <div className="flex items-center flex-col p-8 gap-8">
            <img src={emptyListImage} className="mx-auto w-[200px] opacity-30 grayscale" />
            <span className="text-[#d2dbdf] text-[13px] font-semibold tracking-[2px] whitespace-pre text-left">
              {emptyListMessage}
            </span>
          </div>
        ) : (
          items?.map((item, index) => (
            <Fragment key={index}>
              {/* Section Caption */}
              {isSectionChanging(index) && (
                <ListSection
                  onCollapseChange={(value) => onCollapseChange(value, item.section)}
                  caption={item.section}
                />
              )}

              {!collapsedSections.includes(item.section) && (
                <ListWidgetItem
                  onSelectItem={selectItem}
                  activeItem={activeItem}
                  actions={actions}
                  selectable={selectable}
                  item={item}
                  cn={cn}
                  onSelectChange={onSelectChange}
                  selectedItems={selectedItems}
                />
              )}
            </Fragment>
          ))
        )}
      </div>
    </WidgetComponent>
  )
}
