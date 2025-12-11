import { config } from '@src/config'
import { MOBILE_WIDTH } from '@src/constants'
import type { RootState } from '@src/core'
import { useAppSelector, useWindowEvent } from '@src/hooks'
import { InternalAppContext, isDarkSet, isMobileSet, LinkItem, navigate, WidgetComponentProps } from '@src/modules'
import type { AppContext } from '@src/types'
import { trimSlash } from '@src/utils'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Nav } from './nav'
import { AppWidgets } from './widgets-panel/app-widgets'

type Props = {
  appNav: LinkItem[]

  /**
   * Loading image to show while the app is initializing. Usually a spinner or logo.
   */
  loadingImage: string
  initAppFunc: (cn: AppContext) => Promise<boolean>
  widgetSchemas: WidgetComponentProps[]
  getAppStateHandler: () => RootState
}

let isMobile = window.innerWidth < MOBILE_WIDTH

export const AppLayout: FC<Props> = ({ appNav, loadingImage, initAppFunc, widgetSchemas, getAppStateHandler }) => {
  const [initializing, setInitializing] = useState(true)
  const dispatch = useDispatch()
  const isDark = useAppSelector((state) => state.general.isDark)
  const settings = useAppSelector((state) => state.general.settings)
  const defaultWidgetPath = useAppSelector((state) => state.general.defaultWidgetPath)
  const cn = useMemo(
    () => Object.assign(new InternalAppContext(dispatch, getAppStateHandler, '', '', {}, ''), { config }),
    [dispatch, getAppStateHandler]
  ) as AppContext

  const handleSystemThemeChange = useCallback(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    // Listen for changes in the system theme
    darkModeMediaQuery.addEventListener('change', (e) => {
      dispatch(isDarkSet(settings.theme === 'system' ? e.matches : settings.theme === 'dark'))
    })
  }, [dispatch, settings])

  useEffect(() => {
    handleSystemThemeChange()

    initAppFunc(cn).then(() => {
      setInitializing(false)
    })
  }, [cn, handleSystemThemeChange, initAppFunc])

  useEffect(() => {
    if (defaultWidgetPath) {
      const path = trimSlash(window.location.pathname + window.location.search) || defaultWidgetPath
      navigate(cn, path, 'first')
    }
  }, [defaultWidgetPath, cn])

  useEffect(() => {
    document.documentElement.classList.add(isDark ? 'dark' : 'light')
    document.documentElement.classList.remove(!isDark ? 'dark' : 'light')
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'
  }, [isDark])

  useEffect(() => {
    if (!settings.background) {
      document.documentElement.classList.add('no-bg')
    } else {
      document.documentElement.classList.remove('no-bg')
    }
  }, [settings.background])

  useWindowEvent('resize', () => {
    const mobile = window.innerWidth < MOBILE_WIDTH
    if (mobile !== isMobile) {
      isMobile = mobile
      dispatch(isMobileSet(mobile))
    }
  })

  useWindowEvent('beforeunload', (ev) => {
    const {
      general: { isDirty },
    } = cn.getState()

    if (isDirty) {
      ev.preventDefault()
    }
  })

  function backgroundImage() {
    return `/images/${settings.background}.jpg`
  }

  return initializing ? (
    <div className="flex items-center justify-center w-full h-full">
      <img src={loadingImage} alt="Loading" className="w-[84px] h-[84px]" />
    </div>
  ) : (
    <div className="flex w-screen sm:flex-row sm:h-full max-sm:fixed max-sm:touch-manipulation max-sm:flex-col max-sm:h-full [html.no-bg.dark_&]:bg-neutral-700 [html.no-bg.light_&]:bg-gray-200">
      {!!settings.background && (
        <img src={backgroundImage()} alt="bg" className="fixed -z-10 object-cover h-full w-full" />
      )}
      <Nav items={appNav} cn={cn} />
      <AppWidgets widgetSchemas={widgetSchemas} getAppStateHandler={getAppStateHandler} />
    </div>
  )
}
