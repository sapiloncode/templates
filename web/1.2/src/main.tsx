import { initApp } from '@src/core/init-app'
import type { AppContext } from '@src/types'
import { config } from './config'
import { main } from './main.base'

main(async (cn: AppContext) => {
  if (config.initialized) return

  const success = await initApp(cn)
  if (!success) {
    return false
  }

  // Custom parts

  return true
})
