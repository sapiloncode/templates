import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu'
import { AppContext, WidgetMenuItem } from '@src/types'
import { FC } from 'react'
import { Icon } from '../icon/icon'

type Props = {
  children: React.ReactNode
  cn?: AppContext
  menuItems: WidgetMenuItem[]
  onSelectItem?: (item: WidgetMenuItem) => void
  onOpenChange?: (open: boolean) => void
  align?: 'start' | 'end'
}

export const DropdownMenu: FC<Props> = ({ children, cn, menuItems, onSelectItem, onOpenChange, align = 'end' }) => {
  return (
    <RadixDropdownMenu.Root onOpenChange={onOpenChange}>
      <RadixDropdownMenu.Trigger asChild>{children}</RadixDropdownMenu.Trigger>
      <RadixDropdownMenu.Portal>
        <RadixDropdownMenu.Content
          align={align}
          className="bg-white flex flex-col rounded-md p-1.5 gap-1 shadow-lg animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          style={{ zIndex: 100 }}
        >
          {menuItems.map((item, index) =>
            !item.label ? (
              <RadixDropdownMenu.Separator key={'separator-' + index} className="h-px bg-gray-200 my-1.5 mx-1.5" />
            ) : (
              <RadixDropdownMenu.Item
                key={item.name}
                data-name={item.name}
                onSelect={() => {
                  if (item.handler) {
                    item.handler?.(cn, null)
                  }
                  onSelectItem?.(item)
                }}
                className={`text-[13px] leading-none text-[#11181c] rounded-sm min-w-[160px] flex gap-2 items-center px-2 py-1 relative select-none outline-none cursor-pointer focus:bg-gray-200 ${
                  item.css || ''
                }`}
              >
                {item.icon != null && <Icon icon={item.icon} />}
                {item.label}
              </RadixDropdownMenu.Item>
            )
          )}
        </RadixDropdownMenu.Content>
      </RadixDropdownMenu.Portal>
    </RadixDropdownMenu.Root>
  )
}
