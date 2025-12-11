import cs from 'classnames'
import { FC, HtmlHTMLAttributes } from 'react'

export type IconProps = HtmlHTMLAttributes<HTMLElement> & {
  icon: string
  rotate?: number
}

export const Icon: FC<IconProps> = ({ icon, rotate, className, ...rest }) => {
  if (icon == null) return null
  // empty icon ('') is a valid icon
  return (
    <i
      {...rest}
      data-icon={icon}
      style={{ transform: rotate ? `rotate(${rotate}deg)` : null }}
      className={cs('material-symbols-outlined', className)}
    >
      {icon}
    </i>
  )
}
