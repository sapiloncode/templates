import { config } from '@src/config'
import { $t } from '@src/i18n'
import { DateFormat } from '@src/types'
import {
  addDays,
  addMonths,
  format,
  getDaysInMonth,
  isAfter,
  isBefore,
  isMatch,
  isSameDay,
  isSameYear,
  isToday,
  parse,
  startOfDay,
  startOfQuarter,
  startOfWeek,
} from 'date-fns'

export function startOfLocalWeek(date: Date | number): Date {
  return startOfWeek(date, { weekStartsOn: config.weekStartsOn as 0 | 1 | 2 | 3 | 4 | 5 | 6 })
}

export const isDateWithinDay = (date: Date | string, dateStartOfDay: Date): boolean => {
  if (typeof date === 'string') date = new Date(date)
  return date && isBefore(dateStartOfDay, date) && isAfter(addDays(dateStartOfDay, 1), date)
}

export function getFriendlyDateTitle(value: Date): string {
  if (!value) return ''
  return isSameDay(value, Date.now()) ? format(value, 'HH:mm') : format(value, 'MMMM dd')
}

export function toDateString(date: Date | number | null, dateFormat: DateFormat) {
  if (!date) return ''
  const mdate = new Date(date)

  switch (dateFormat) {
    case DateFormat.BriefDateTime:
      if (isToday(mdate)) return format(mdate, 'HH:mm')
      else if (isSameYear(Date.now(), mdate)) return format(mdate, 'MMM d')
      else return format(mdate, 'dd/MM/yyyy')

    case DateFormat.FullDateTime:
      if (isSameYear(Date.now(), mdate)) return format(mdate, 'MMM d - H:mm a')
      else return format(mdate, 'd/M/yy - H:mm a')

    default:
      return format(mdate, 'dd/MM/yyyy')
  }
}

export function parseDate(date: string): Date | null {
  if (date === $t.TODAY.toLowerCase()) return new Date()
  const formats = ['yyyy', 'MMM yyyy', 'MMMM yyyy', 'yyyy MMM', 'dd MMM yyyy', 'dd/MM/yyyy']
  for (const format of formats) {
    if (isMatch(date, format)) return parse(date, format, new Date())
  }
  return null
}

export function today() {
  return startOfDay(new Date())
}

export function getDaysInQuarter(date: number | Date) {
  const start = startOfQuarter(date)
  return [0, 1, 2].reduce((totalDays, monthOffset) => {
    return totalDays + getDaysInMonth(addMonths(start, monthOffset))
  }, 0)
}

export function getTime(date: string | number | Date | null | undefined): number | null {
  if (typeof date === 'string') {
    return new Date(date).getTime()
  } else if (typeof date === 'number') {
    return date
  } else {
    return date?.getTime()
  }
}
