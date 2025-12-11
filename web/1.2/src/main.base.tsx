import Logo from '@src/assets/images/logo.png'
import { DialogProvider, GeneralError } from '@src/components'
import { AppLayout } from '@src/components/app-layout/app-layout'
import { PATH_GENERAL_ERROR } from '@src/constants'
import type { WidgetComponentProps } from '@src/modules'
import { reportWebVitals } from '@src/utils'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import { Provider } from 'react-redux'
import pkg from '../package.json'
import { appNav } from './core/app-nav'
import { getAppState, store } from './core/store'
import './styles'
import { AppContext } from './types'

export function main(initAppFunc: (cn: AppContext) => Promise<boolean>) {
  console.debug('Version :', pkg.version)

  const widgetSchemas = Object.values(import.meta.glob('src/modules/**/widgets/**/widget.ts', { eager: true })).map(
    (m: { default: unknown }) => m.default
  ) as WidgetComponentProps[]

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Provider store={store}>
        <DialogProvider>
          <ErrorBoundary FallbackComponent={GeneralError}>
            {location.pathname === `/${PATH_GENERAL_ERROR}` ? (
              <GeneralError />
            ) : (
              <>
                <AppLayout
                  appNav={appNav}
                  loadingImage={Logo}
                  initAppFunc={initAppFunc}
                  widgetSchemas={widgetSchemas}
                  getAppStateHandler={getAppState}
                />
              </>
            )}
          </ErrorBoundary>
        </DialogProvider>
      </Provider>
    </StrictMode>
  )

  reportWebVitals()
}
