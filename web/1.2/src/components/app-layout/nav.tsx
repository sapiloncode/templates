import { Icon } from '@src/components'
import { PATH_ACCOUNT } from '@src/constants'
import { useAppSelector } from '@src/hooks'
import type { LinkItem } from '@src/modules'
import { navigate, processUrlTemplate } from '@src/modules'
import type { AppContext } from '@src/types'
import { trimSlash, vibrate } from '@src/utils'
import cs from 'classnames'
import { FC } from 'react'

type Props = {
  items: LinkItem[]
  cn: AppContext
}

export const Nav: FC<Props> = ({ items, cn }) => {
  const { columns: currentWidgets } = useAppSelector((state) => state.general)
  const notifications = useAppSelector((cn) => cn.general.notifications)
  const isNavHidden = useAppSelector((cn) => cn.general.isNavHidden)

  const NotifyBadge = ({ url }: { url: string }) => {
    const count = notifications[trimSlash(url)]
    //! temporary disabled!
    if (!count || count) return null
    return (
      <div className="absolute bg-red-600 rounded-full w-6 h-6 text-white flex items-center justify-center -mt-[2.8rem] z-[1] border-2 border-white max-sm:left-[1.8rem] sm:left-[2.8rem]">
        {count > 9 ? '*' : count}
      </div>
    )
  }

  function isLinkActive(href: string) {
    const index = currentWidgets.findIndex((widget) => widget.href === cn.href)
    const adjacentSegment = index === -1 ? 0 : index + 1
    const adjacentWidget = currentWidgets[adjacentSegment]
    if (!adjacentWidget) {
      return false
    }

    const fullPath = adjacentWidget.pathname + adjacentWidget.search
    return fullPath === trimSlash(href)
  }

  function handleSelectItem(item: LinkItem) {
    navigate(cn, processUrlTemplate(cn, item.url))
    vibrate('sm')
  }

  function handleSelectAccount() {
    navigate(cn, PATH_ACCOUNT, 'first')
    vibrate('sm')
  }

  return (
    !isNavHidden && (
      <nav
        className={cs(
          'bg-green-800 text-neutral-300 flex flex-col items-stretch',
          'w-[var(--nav-width)] min-w-[var(--nav-width)]',
          'max-sm:flex-row max-sm:h-[calc(4rem+env(safe-area-inset-bottom))] max-sm:pb-[env(safe-area-inset-bottom)]',
          'max-sm:order-2 max-sm:w-full max-sm:items-center max-sm:justify-around',
          'max-sm:text-neutral-500 max-sm:bg-neutral-100 max-sm:border-t max-sm:border-neutral-200',
          'sm:pt-4 sm:h-full'
        )}
      >
        {items.map((item, index) => (
          // Nav Item
          <a
            className={cs(
              'cursor-pointer relative select-none flex flex-col items-center justify-center no-underline text-center sm:h-[4.5rem] sm:hover:bg-white/10 max-sm:w-[4.5rem]',
              {
                'text-white bg-white/25': isLinkActive(processUrlTemplate(cn, item.url)) && window.innerWidth >= 600,
                "text-green-600 [&_.nav-icon]:font-['FILL'_1]":
                  isLinkActive(processUrlTemplate(cn, item.url)) && window.innerWidth < 600,
              }
            )}
            key={index}
            onTouchStart={(ev) => ev.preventDefault()}
            onClick={() => handleSelectItem(item)}
          >
            <NotifyBadge url={item.url} />
            <Icon icon={item.icon} className="nav-icon cursor-pointer !text-3xl" />
            <span className="caption text-[11px] font-bold cursor-pointer">{item.label}</span>
          </a>
        ))}

        <div className="max-sm:hidden sm:flex-1"></div>

        {/* Account link */}
        <a
          className={cs(
            'cursor-pointer relative select-none flex flex-col items-center justify-center no-underline text-center',
            'sm:h-[4.5rem] sm:hover:bg-white/10',
            'max-sm:w-[4.5rem]'
          )}
          onClick={handleSelectAccount}
        >
          <Icon icon="account_circle" className="nav-icon text-[32px] cursor-pointer" />
          <span className="caption text-[11px] font-bold cursor-pointer">Account</span>
        </a>
      </nav>
    )
  )
}
