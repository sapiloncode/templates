import { config } from '@src/config'
import { Day, startOfWeek } from 'date-fns'

export function startOfLocalWeek(time: number | Date) {
  return startOfWeek(time, { weekStartsOn: config.weekStartsOn as Day })
}
