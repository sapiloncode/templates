import cs from 'classnames'
import { FC, HTMLAttributes } from 'react'
import { Icon } from '../icon/icon'
import './icon-button.css'

type Props = HTMLAttributes<HTMLElement> & {
  icon: string
  disabled?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'info' | 'light' | 'dark'
  variant?: 'solid' | 'outline' | 'text'
  rotate?: number
  round?: boolean
}

export const IconButton: FC<Props> = ({
  size = 'sm',
  color,
  variant = 'text',
  disabled,
  className,
  icon,
  rotate,
  round,
  ...props
}) => {
  return (
    <div
      role="button"
      className={cs('btn-icon', className, 'btn-' + size, color ? 'btn-' + color : null, 'btn-' + variant, {
        disabled: disabled,
        'rounded-full': round,
      })}
      {...props}
    >
      <Icon icon={icon} rotate={rotate} />
    </div>
  )
}
