import { apiGetVersion, apiSession } from '@api'
import { figlet } from '@src/assets/figlet'
import { config, initConfig } from '@src/config'
import { PATH_GENERAL_ERROR, PATH_WEB_LOGIN_CALLBACK, STORAGE_KEY_TOKEN } from '@src/constants'
import { setDefaultWidgetPath } from '@src/modules'
import { AppContext } from '@src/types'
import { trimSlash } from '@src/utils'
import queryString from 'query-string'

export async function initApp(cn: AppContext) {
  initConfig()
  setDefaultWidgetPath(cn, config.defaultWidgetPath)

  const query = queryString.parse(window.location.search)
  console.debug('initApp, path:', location.pathname)

  if (trimSlash(location.pathname) === PATH_GENERAL_ERROR) {
    return false
  }

  if (query.error) {
    window.location.href = `/${PATH_GENERAL_ERROR}?message=${query.error}`
    return false
  }

  if (trimSlash(location.pathname) === PATH_WEB_LOGIN_CALLBACK) {
    console.debug('LOGIN CALLBACK, sid:', query.sid)
    const { token } = await apiSession({ sid: query.sid as string })
    localStorage.setItem(STORAGE_KEY_TOKEN, token)
    window.location.href = '/'
    return false
  }

  const apiVersion = await apiGetVersion()
  if (!apiVersion) {
    console.error('initApp failed, error getting api version!')
    return false
  } else {
    console.debug('initApp done, api version:', apiVersion)
  }

  console.info(figlet)
  return true
}
