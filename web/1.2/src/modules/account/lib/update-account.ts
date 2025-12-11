import { apiUpdateAccount, UpdateAccountArgs } from '@api'
import { getAppState } from '@src/core'
import { showWidgetMessage } from '@src/modules'
import { accountUpdated } from '@src/modules/account/state/slice'
import type { AppContext } from '@src/types'

export async function updateAccount(cn: AppContext, update: UpdateAccountArgs) {
  try {
    const {
      account: { account },
    } = getAppState()

    await apiUpdateAccount({ id: account.id }, update)
    cn.dispatch(accountUpdated(update))
  } catch (ex) {
    showWidgetMessage(cn, { text: ex.message, type: 'error' })
  }
}
