import { config } from '@src/config'
import { getAppState } from '@src/core'
import { getAppVersion } from '@src/modules'

export async function checkVersionPeriodically() {
  setInterval(async () => {
    try {
      const {
        general: { isDirty, apiVersion },
      } = getAppState()

      if (isDirty) {
        return
      }

      const version = await getAppVersion()

      // Reload if a new version is available
      if (apiVersion !== (version as string).split(' ')[0]) {
        location.reload()
      }
    } catch (ex) {
      console.error(ex)
    }
  }, config.checkVersionInterval)
}
