import type { DialogMessageType, WidgetAction } from '@src/modules'
import type { AppContext } from '@src/types'

export type ShowDialogMessageParams = {
  description: string
  title: string
  type: DialogMessageType
  actions?: WidgetAction[]
  cn: AppContext

  /**
   * Used for testing purposes
   */
  name?: string
}

let showModal: (params: ShowDialogMessageParams) => void

export function registerModal(fn: typeof showModal) {
  showModal = fn
}

export function showDialogMessage(content: ShowDialogMessageParams) {
  if (showModal) {
    showModal(content)
  }
}
