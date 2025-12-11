import cs from 'classnames'
import { FC, HTMLAttributes } from 'react'
import './button.css'

type Props = HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'info' | 'light' | 'dark'
  variant?: 'solid' | 'outline' | 'text'
}

export const Button: FC<Props> = ({
  size = 'md',
  color,
  variant,
  disabled,
  className,
  children,
  onClick,
  ...props
}) => {
  return (
    <div
      role="button"
      className={cs('btn', color ? 'btn-' + color : '', variant ? 'btn-' + variant : '', 'btn-' + size, className, {
        disabled: disabled,
      })}
      onClick={(ev) => !disabled && onClick?.(ev)}
      {...props}
    >
      {children}
    </div>
  )
}
