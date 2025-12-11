import React, { KeyboardEvent } from 'react'
import { KEY_DONE, KEY_ENTER, KEY_ESCAPE, KEY_GO } from '@src/constants'

interface Props extends React.HTMLAttributes<HTMLInputElement>, React.RefAttributes<HTMLInputElement> {
  onPressEnter?: (value: string) => void
  onCancel?: () => void
  onValueChange?: (value: string) => void
  clearOnPressEnter?: boolean
  autoFocus?: boolean
  initialValue?: string
  placeholder?: string
  name?: string
}

export const Input = React.forwardRef<HTMLInputElement, Props>(
  ({ onPressEnter, onCancel, onValueChange, clearOnPressEnter, placeholder, name, initialValue, ...rest }, ref) => {
    const [value, setValue] = React.useState(initialValue)

    function handleKeyPress(ev: KeyboardEvent<HTMLInputElement>) {
      if ((ev.code === KEY_ENTER || ev.code === KEY_DONE || ev.code === KEY_GO) && onPressEnter) {
        onPressEnter(ev.currentTarget.value)
        if (clearOnPressEnter) {
          ev.currentTarget.value = ''
          setValue('')
        }
      } else if (ev.code === KEY_ESCAPE && onCancel) {
        onCancel()
        ev.currentTarget.value = ''
      }
    }

    function handleChange(ev: React.ChangeEvent<HTMLInputElement>) {
      setValue(ev.target.value)
      onValueChange?.(ev.target.value)
    }

    return (
      <input
        className="border-none bg-transparent w-full"
        placeholder={placeholder}
        name={name}
        {...rest}
        value={value}
        onKeyDown={handleKeyPress}
        onChange={handleChange}
        ref={ref}
      />
    )
  }
)
Input.displayName = 'Input'
