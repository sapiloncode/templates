import { Account } from '@src/modules'
import { ActionStatus } from '@src/types'

export type AccountState = {
  loadingStatus: ActionStatus
  account?: Account
  error?: string
  permissions: {
    chatEnabled: boolean // Shows Chat Form, Starts Web Sockets
    reminderEnabled: boolean
  }
}

export const initialState: AccountState = {
  loadingStatus: ActionStatus.Default,
  account: null,
  permissions: {
    chatEnabled: false,
    reminderEnabled: false,
  },
}
