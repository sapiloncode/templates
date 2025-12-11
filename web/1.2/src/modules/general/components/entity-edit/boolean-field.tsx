import cs from 'classnames'
import { FC } from 'react'

type Props = {
  name: string
  onChange: (value: boolean | null) => void
  value: boolean | null
  nullable: boolean
  trueText?: string
  falseText?: string
  nullText?: string
}

export const BooleanField: FC<Props> = ({
  name,
  onChange,
  value,
  nullable,
  trueText = 'YES',
  falseText = 'NO',
  nullText = 'N/A',
}) => {
  function handleChange(value: boolean | null) {
    onChange(value)
  }

  return (
    <div data-name={name} className="flex flex-row items-center border border-gray-200 rounded-lg overflow-hidden">
      <div
        onClick={() => handleChange(true)}
        className={cs(
          'border-none py-2 px-4 cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] border-r border-neutral-200 hover:bg-neutral-100 hover:text-gray-500',
          { 'bg-neutral-500 text-neutral-100': value === true }
        )}
      >
        {trueText}
      </div>
      <div
        onClick={() => handleChange(false)}
        className={cs(
          'border-none py-2 px-4 cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:bg-neutral-100 hover:text-gray-500',
          { 'bg-neutral-500 text-neutral-100': value === false },
          { 'border-r border-neutral-200': nullable }
        )}
      >
        {falseText}
      </div>
      {nullable && (
        <div
          onClick={() => handleChange(null)}
          className={cs(
            'border-none py-2 px-4 cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:bg-neutral-100 hover:text-gray-500',
            { 'bg-neutral-500 text-neutral-100 opacity-50': value == null }
          )}
        >
          {nullText}
        </div>
      )}
    </div>
  )
}
