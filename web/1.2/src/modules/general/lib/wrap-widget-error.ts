import { AppContext, UserError } from '@src/types'
import { showWidgetMessage } from './show-widget-message'

export async function wrapWidgetError<T>(cn: AppContext, fn: () => T): Promise<T> {
  try {
    return await fn()
  } catch (ex) {
    if (ex instanceof UserError) {
      showWidgetMessage(cn, { text: ex.message, type: 'error' })
    } else {
      console.error(ex)
      throw ex
    }
  }
}
