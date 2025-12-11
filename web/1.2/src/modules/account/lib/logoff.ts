import { apiLogout } from '@api'
import { config } from '@src/config'
import { STORAGE_KEY_TOKEN } from '@src/constants'
import { sendMobileHostCommand } from '@src/utils'

export async function logout() {
  localStorage.removeItem(STORAGE_KEY_TOKEN)

  if (!sendMobileHostCommand('Logoff')) {
    await apiLogout()
    // after logout redirect to this address
    location.href = config.afterLogoutUrl
  }
}
