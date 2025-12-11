import { Button, IconButton } from '@src/components'
import { DAYS_OF_WEEK, FORMAT_DATE, WEEK_DAYS } from '@src/constants'
import { startOfLocalWeek, today } from '@src/utils'
import cs from 'classnames'
import { add, differenceInMonths, format, isBefore, isSameMonth, isToday, startOfMonth } from 'date-fns'
import { FC, useCallback, useEffect, useState } from 'react'

type Day = {
  day: number
  date: Date
  key: string
  selected: boolean
  today: boolean
  disabled: boolean
  css: string
}

export type DateStyle = {
  date: string
  css: string
}

type Props = {
  initialValue: string[]
  multiSelect?: boolean
  onChanged: (selectedDates: string[] | string) => void
  onFocus?: (focusDate: string) => void
  dateStyles?: DateStyle[]
  landingDate?: string
}

export const Calendar: FC<Props> = ({ initialValue, onChanged, multiSelect, dateStyles, landingDate, onFocus }) => {
  const [selectedDates, setSelectedDates] = useState(initialValue)
  const [stage, setStage] = useState<'day' | 'month'>('day')
  const [offset, setOffset] = useState(0) // in months
  const [days, setDays] = useState<Day[]>([])
  const [monthLabel, setMonthLabel] = useState('')
  const [firstVisibleYear, setFirstVisibleYear] = useState(2020)
  const [selectedYear, setSelectedYear] = useState(0)
  const [selectedMonth, setSelectedMonth] = useState(0)
  const [focusDate, setFocusDate] = useState(landingDate)
  const WEEK_ROWS = 6

  const calculateStartingDay = useCallback(() => {
    const firstDayOfMonth = add(startOfMonth(new Date()), { months: offset })
    const calendarFirstDay = startOfLocalWeek(firstDayOfMonth)
    return { calendarFirstDay, firstDayOfMonth }
  }, [offset])

  const getDayStyle = useCallback(
    (date: string) => {
      const styledDate = dateStyles?.find((dt) => dt.date === date)
      return styledDate?.css
    },
    [dateStyles]
  )

  const generateCalendarDays = useCallback(() => {
    const { calendarFirstDay, firstDayOfMonth } = calculateStartingDay()
    const ds = []

    for (let i = 0; i < WEEK_ROWS * WEEK_DAYS; i++) {
      const date = add(calendarFirstDay, { days: i })
      const key = format(date, FORMAT_DATE)
      const day: Day = {
        date,
        key,
        day: date.getDate(),
        disabled: !isSameMonth(date, firstDayOfMonth),
        selected: selectedDates.includes(key),
        css: getDayStyle(key),
        today: isToday(date),
      }
      ds.push(day)
    }

    setDays(ds)
    setMonthLabel(format(firstDayOfMonth, 'MMMM yyyy'))
  }, [selectedDates, calculateStartingDay, getDayStyle])

  useEffect(() => {
    generateCalendarDays()
  }, [generateCalendarDays])

  useEffect(() => {
    const [lastSelectedDate] = focusDate ? [focusDate] : [...initialValue].reverse() // To shift to the last selected date
    const date = lastSelectedDate ? new Date(lastSelectedDate) : today()
    const firstDayOfMonth = startOfMonth(date)
    const offset = differenceInMonths(firstDayOfMonth, startOfMonth(new Date()))
    setOffset(offset)
  }, [initialValue, focusDate])

  function years() {
    return Array.from({ length: 5 }, (_, i) => firstVisibleYear + i)
  }

  function navigate(offset: number) {
    setOffset(offset)
  }

  function moveYear(offset: number) {
    setFirstVisibleYear((val) => val + offset)
  }

  function getMonths() {
    return Array.from({ length: 12 }, (_, i) => format(new Date(2000, i, 1), 'MMMM'))
  }

  function selectMonth(month: number) {
    const date = add(new Date(), { months: offset })
    setSelectedYear(date.getFullYear())
    setSelectedMonth(date.getMonth())
    setFirstVisibleYear(Math.floor(selectedYear / 5) * 5)

    const targetDate = new Date(selectedYear, month, 1)
    navigateToDate(targetDate)
  }

  function navigateToDate(date: Date) {
    setStage('day')
    const offset = date ? differenceInMonths(startOfMonth(date), startOfMonth(new Date())) : 0
    navigate(offset)
  }

  function handleClickDay(day: Day) {
    if (day.disabled) return
    const date = format(day.date, FORMAT_DATE)

    if (multiSelect) {
      const willBeSelected = !selectedDates.includes(date)
      const selection = willBeSelected ? [...selectedDates, date] : selectedDates.filter((d) => d !== date)

      setSelectedDates(selection)
      onChanged(selection)
    } else {
      setSelectedDates([date])
      onChanged(date)
    }
  }

  function handleHoverDay(day: Day) {
    if (!day.disabled) {
      setFocusDate(day.key)
      onFocus?.(day.key)
    }
  }

  return (
    <div className="bg-white border-b border-gray-200">
      {stage === 'day' ? (
        <div className="px-4 sm:px-8 py-4">
          {/* Header */}
          <div className="flex justify-center items-center py-4 gap-4 border-b border-gray-200 overflow-hidden sm:justify-between">
            <IconButton onClick={() => navigate(offset - 1)} icon="chevron_left" size="sm" className="[&_i]:text-2xl" />

            {/* Row of buttons and label */}
            <div className="flex flex-grow items-center justify-left nowrap">
              {!!offset && (
                <IconButton onClick={() => navigate(0)} icon="circle" className="text-4xl" color="warning" />
              )}

              <Button color="dark" variant="text" onClick={() => setStage('month')}>
                {monthLabel}
              </Button>
            </div>

            <IconButton onClick={() => navigate(offset + 1)} icon="chevron_right" className="[&_i]:text-2xl" />
          </div>

          {/* Days of Week */}
          <div className="pt-2 grid gap-0.5 grid-cols-7">
            {DAYS_OF_WEEK.map((day) => (
              <div
                key={day}
                className="flex justify-center items-center text-xs text-stone-500 cursor-pointer uppercase select-none"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="py-4 grid gap-1 grid-cols-7 grid-rows-6 justify-center items-center">
            {days.map((day) => (
              <div
                onMouseEnter={() => handleHoverDay(day)}
                key={day.key}
                onClick={() => handleClickDay(day)}
                className={cs(day.css, {
                  'flex justify-center items-center h-9 text-base font-medium text-gray-800 bg-white cursor-pointer rounded-lg overflow-hidden transition-all duration-100 select-none min-w-10': 1,
                  '!font-bold': day.selected,
                  '!text-3xl': day.key === focusDate,
                  '!text-gray-300 hover:text-base': day.disabled,
                  '!bg-green-300': day.selected && !day.disabled,
                  '!bg-gray-400': day.selected && !day.disabled && isBefore(day.date, today()),
                  '!outline-3 !outline-orange-500 !border-2 !border-white': !day.disabled && day.today,
                })}
              >
                {day.day}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-row items-center justify-center py-8 px-4">
          <IconButton icon="cancel" onClick={() => setStage('day')} className="text-gray-500 absolute right-0 top-12" />

          {/* Months selector */}
          <div className="grid grid-cols-2 grid-rows-6 grid-flow-col gap-2 px-4 border-r border-dashed border-gray-300">
            {getMonths().map((month, index) => (
              <div
                key={index}
                onClick={() => selectMonth(index)}
                className={cs({
                  'p-3 cursor-pointer text-left whitespace-nowrap rounded bg-white hover:bg-neutral-100 text-gray-800 w-25': 1,
                  '!bg-green-100 font-medium': selectedMonth == index,
                  'font-light': selectedMonth != index,
                })}
                style={{ width: '100px' }}
              >
                {month}
              </div>
            ))}
          </div>

          {/* Years selector */}
          <div className="flex flex-col justify-center items-center pl-4">
            <IconButton icon="expand_less" onClick={() => moveYear(-5)} className="text-4xl" />
            {years().map((year) => (
              <div
                key={year}
                onClick={() => setSelectedYear(year)}
                className={cs(
                  'p-3 cursor-pointer text-center whitespace-nowrap rounded bg-white hover:bg-neutral-100 text-gray-800 w-25',
                  {
                    'bg-green-300 font-medium': selectedYear == year,
                    'font-light': selectedYear != year,
                  }
                )}
                style={{ width: '100px' }}
              >
                {year}
              </div>
            ))}
            <IconButton icon="expand_more" onClick={() => moveYear(5)} className="text-4xl" />
          </div>
        </div>
      )}
    </div>
  )
}
