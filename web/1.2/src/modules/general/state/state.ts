import { config } from '@src/config'
import {
  DEFAULT_THEME,
  DEFAULT_USER_COLOR,
  MOBILE_WIDTH,
  STORAGE_KEY_BACKGROUND,
  STORAGE_KEY_COLOR,
  STORAGE_KEY_NOTIFICATION_SOUND,
  STORAGE_KEY_THEME,
} from '@src/constants'
import { isDark } from '@src/utils'
import { WidgetColumn } from '../types'

type Theme = 'dark' | 'light' | 'system'

export type GeneralStateSettings = { theme: Theme; color: string; background: string; notificationSound: string }

const theme = (localStorage.getItem(STORAGE_KEY_THEME) as Theme) || DEFAULT_THEME
const color = localStorage.getItem(STORAGE_KEY_COLOR) || DEFAULT_USER_COLOR
const background = localStorage.getItem(STORAGE_KEY_BACKGROUND)
const notificationSound = localStorage.getItem(STORAGE_KEY_NOTIFICATION_SOUND) || config.defaultNotificationSound

export type GeneralState = {
  notifications: { [pathname: string]: number }
  isTouch: boolean
  isMobile: boolean
  isDark: boolean
  settings: { theme: Theme; color: string; background: string; notificationSound: string }

  /**
   * Determines if the navigation bar is hidden.
   * This is applicable only on mobile devices and is triggered when the user enters note editing mode.
   */
  isNavHidden: boolean

  isDirty: boolean
  apiVersion: string

  calendar: {
    /**
     * Indicates whether hidden topics should be displayed in the Calendar view.
     * Hidden topics include those with more than five steps in the current month.
     */
    displayingHiddenTopics: boolean

    /**
     * Indicates whether there are topics in the current calendar view that need to be hidden
     * due to exceeding the repetition limit (more than 7 times in the month).
     */
    hasHiddenTopics: boolean
  }

  smartPanel: {
    messages: {
      /**
       * Markdown content
       */
      content: string
      timestamp: number
      type: 'info' | 'error'
    }[]
  }

  columns: WidgetColumn[]
  widgetState: { href: string; state: unknown }[]
  defaultWidgetPath: string
}

export const initialState: GeneralState = {
  notifications: {},
  isMobile: window.innerWidth < MOBILE_WIDTH,
  isTouch: false,
  settings: {
    background,
    color,
    theme,
    notificationSound,
  },
  isDark: isDark(theme),
  isNavHidden: false,
  isDirty: false,
  apiVersion: '',
  calendar: {
    displayingHiddenTopics: false,
    hasHiddenTopics: false,
  },
  smartPanel: {
    messages: [],
  },
  columns: [],
  widgetState: [],
  defaultWidgetPath: '  ',
}
