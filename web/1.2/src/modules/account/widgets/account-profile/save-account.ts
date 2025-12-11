import { closeWidget } from '@src/modules'
import { updateAccount } from '@src/modules/account'
import type { AppContext } from '@src/types'

export async function saveAccount(cn: AppContext, { entity }: { entity: unknown }) {
  const { firstName, lastName } = entity as { firstName: string; lastName: string }
  await updateAccount(cn, { firstName, lastName })
  closeWidget(cn)
}
