import { NON_BREAKING_SPACE } from '@src/constants'
import { ID, SelectOption } from '@src/types'
import cs from 'classnames'
import { Select as RadixSelect } from 'radix-ui'
import React, { FC, useEffect, useRef, useState } from 'react'
import { Icon } from '../icon/icon'

type Props = {
  options: SelectOption[]
  value: ID
  readOnly?: boolean
  name?: string
  onChange: (value: ID) => void
  id?: string
  resetButton?: boolean
  allowSearch?: boolean
  favoriteKey?: string
  autofocus?: boolean
  placeholder?: string
  maxWidth?: number // px
  maxHeight?: number // px
}

export const Select: FC<Props> = ({
  options,
  value,
  onChange,
  name,
  allowSearch = false,
  autofocus = false,
  placeholder,
  favoriteKey,
}) => {
  const [searchPhrase, setSearchPhrase] = useState('')
  const [visibleOptions, setFilteredOptions] = useState(options)
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setFilteredOptions(
      (options || []).filter((option) => option.title.toLowerCase().includes(searchPhrase.toLowerCase()))
    )
  }, [searchPhrase, options])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPhrase(event.target.value)
  }

  return (
    <RadixSelect.Root value={String(value)} onValueChange={onChange}>
      <RadixSelect.Trigger className="SelectTrigger" aria-label={name}>
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon className="SelectIcon">
          <Icon icon="arrow_drop_down" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content className="SelectContent">
          {allowSearch && (
            // SearchBar
            <div className="flex items-center p-2 border-b border-gray-200">
              <Icon icon="search" />
              <input
                autoFocus={autofocus}
                ref={searchInputRef}
                type="text"
                name="name"
                tabIndex={-1}
                value={searchPhrase}
                onChange={handleSearchChange}
              />
            </div>
          )}
          <RadixSelect.ScrollUpButton className="SelectScrollButton">
            <Icon icon="arrow_drop_up" />
          </RadixSelect.ScrollUpButton>
          <RadixSelect.Viewport className="SelectViewport">
            {visibleOptions.map((option) => (
              <SelectItem key={option.id} value={String(option.id)}>
                {/* Caption */}
                <span className="label-text">{option.title || NON_BREAKING_SPACE}</span>

                {/* Favorite */}
                {!!favoriteKey && <Icon className="hidden" icon="star" />}
              </SelectItem>
            ))}
          </RadixSelect.Viewport>
          <RadixSelect.ScrollDownButton className="SelectScrollButton">
            <Icon icon="arrow_drop_down" />
          </RadixSelect.ScrollDownButton>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  )
}

type SelectItemProps = {
  children: React.ReactNode
  className?: string
  value: string
  disabled?: boolean
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <RadixSelect.Item className={cs('SelectItem', className)} {...props} ref={forwardedRef}>
        <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
        <RadixSelect.ItemIndicator className={'SelectItemIndicator'}>
          <Icon icon="check" />
        </RadixSelect.ItemIndicator>
      </RadixSelect.Item>
    )
  }
)
