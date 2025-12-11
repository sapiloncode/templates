import { Calendar, Icon } from '@src/components'
import { getTime } from '@src/utils'
import { format } from 'date-fns'
import { Popover } from 'radix-ui'
import { FC, KeyboardEvent, useState } from 'react'

type Props = {
  value: string | number | Date
  name?: string
  dateFormat?: string
  onChange: (ev: { value: string }) => void
}

export const InputDate: FC<Props> = ({ value, onChange, name, dateFormat = 'yyyy-MM-dd' }) => {
  const [selectedDate, setSelectedDate] = useState<string>(value ? format(getTime(value), dateFormat) : '')
  const [open, setOpen] = useState(false)

  function handleCalendarChange(selectedDate: string) {
    setSelectedDate(selectedDate)
    onChange({ value: selectedDate })
    setOpen(false)
  }

  function handleInputChange(value: string) {
    onChange({ value })
  }

  function handleKeyDown(ev: KeyboardEvent, value: string) {
    if (ev.key === 'Enter') {
      onChange({ value })
    }
  }

  return (
    <div className="input-date outline-none rounded-lg flex flex-col items-center justify-center text-sm h-[38px] relative px-2 [&_.popover]:absolute [&_.popover]:left-0 [&_i]:sm:cursor-pointer [&_i]:max-sm:text-2xl">
      <div className="inline-flex flex-row items-center justify-center whitespace-nowrap">
        <input
          name={name}
          className="flex-grow outline-none"
          value={selectedDate}
          onChange={(ev) => setSelectedDate(ev.currentTarget.value)}
          onBlur={(ev) => handleInputChange(ev.currentTarget.value)}
          onKeyDown={(ev) => handleKeyDown(ev, ev.currentTarget.value)}
        />
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <Icon icon="calendar_today" color="primary" />
          </Popover.Trigger>
          <Popover.Content>
            <Calendar initialValue={[selectedDate]} onChanged={handleCalendarChange} />
          </Popover.Content>
        </Popover.Root>
      </div>
    </div>
  )
}
