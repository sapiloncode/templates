import { Account } from '@prisma/client'
import { db } from '@src/core'

export async function getOrCreateAccount(email: string, firstName: string, lastName: string): Promise<Account> {
  let account = await db.account.findFirst({ where: { email } })
  if (!account)
    account = await db.account.create({
      data: {
        email,
        created: new Date(),
        firstName,
        lastName,
      },
    })

  return account
}
