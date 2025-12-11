import { STORAGE_KEY_TOKEN } from '@src/constants'

export type ConfigBase = {
  initialized: boolean
  env: string
  isDevelopment: boolean
  apiBaseUri: string
  signinUrl: string
  authToken: string
  defaultWidgetPath: string
  defaultNotificationSound: string
  checkVersionInterval: number
  languages: { key: string; title: string }[]
  weekStartsOn: 0 | 2 | 1 | 5 | 3 | 4 | 6
  afterLogoutUrl: string
}

export function initBaseConfig() {
  const signinCallback = encodeURIComponent(location.origin + location.pathname)

  const config: ConfigBase = {
    initialized: true,
    env: import.meta.env.MODE,
    isDevelopment: import.meta.env.DEV,
    signinUrl: `${import.meta.env.VITE_API_BASE_URL}/auth/login?back=${signinCallback}`,
    apiBaseUri: import.meta.env.VITE_API_BASE_URL,
    authToken: localStorage.getItem(STORAGE_KEY_TOKEN) || '',

    defaultNotificationSound: 'Cheerful Melody',

    checkVersionInterval: 30 * 1000,
    defaultWidgetPath: '/',

    languages: [
      { key: 'en', title: 'English' },
      { key: 'nl', title: 'Dutch' },
    ],
    weekStartsOn: 1 as 0 | 2 | 1 | 5 | 3 | 4 | 6, // Monday
    afterLogoutUrl: '/',
  }

  return config
}
