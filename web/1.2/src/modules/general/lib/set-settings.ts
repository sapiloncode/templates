import {
  STORAGE_KEY_BACKGROUND,
  STORAGE_KEY_COLOR,
  STORAGE_KEY_NOTIFICATION_SOUND,
  STORAGE_KEY_THEME,
} from '@src/constants'
import type { AppContext } from '@src/types'
import { isDark, localStorageWrite } from '@src/utils'
import { GeneralStateSettings, isDarkSet, settingsSet } from '../state'

export function setSettings(cn: AppContext, settings: GeneralStateSettings) {
  localStorageWrite(STORAGE_KEY_THEME, settings.theme)
  localStorageWrite(STORAGE_KEY_COLOR, settings.color)
  localStorageWrite(STORAGE_KEY_BACKGROUND, settings.background)
  localStorageWrite(STORAGE_KEY_NOTIFICATION_SOUND, settings.notificationSound)

  cn.dispatch(settingsSet(settings))
  cn.dispatch(isDarkSet(isDark(settings.theme)))
}
