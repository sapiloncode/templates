import { UserSession } from '@api'

export function getUserTitle(user: UserSession): string {
  return [user.firstName, user.lastName].filter(Boolean).join(' ').trim()
}
