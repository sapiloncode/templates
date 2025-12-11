import cs from 'classnames'
import React, { MouseEvent } from 'react'
import { useAppSelector } from '@src/hooks'
import { navigate } from '@src/modules'
import type { AppContext } from '@src/types'
import { trimSlash } from '@src/utils'

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string
  cn: AppContext
  className?: string
  onClick?: () => void
}

const FIRST_COLUMN = 0

export const Link: React.FC<Props> = ({ cn, to, children, className, onClick, ...attrs }) => {
  const { columns: currentWidgets } = useAppSelector((state) => state.general)

  function handleClick(ev: MouseEvent) {
    ev.preventDefault()
    if (onClick) {
      onClick()
    } else {
      navigate(cn, to)
    }
  }

  function isActive() {
    const index = currentWidgets.findIndex((widget) => widget.href === cn.href)
    const adjacentSegment = index === -1 ? FIRST_COLUMN : index + 1
    const adjacentWidget = currentWidgets[adjacentSegment]
    if (!adjacentWidget) {
      return false
    }

    const fullPath = adjacentWidget.pathname + adjacentWidget.search
    return fullPath === trimSlash(to)
  }

  return (
    <a
      href={to}
      onClick={handleClick}
      {...attrs}
      className={cs('flex items-center relative cursor-pointer [&_i]:cursor-pointer', className, {
        active: isActive(),
      })}
    >
      {children}
    </a>
  )
}
