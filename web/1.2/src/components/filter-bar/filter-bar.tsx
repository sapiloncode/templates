import { FieldSchema } from '@src/types'
import { capitalize } from 'lodash-es'
import { FC } from 'react'

type Props = {
  fields: FieldSchema[]
}

const FilterField = ({ field }: { field: FieldSchema }) => {
  switch (field.type) {
    case 'number':
      return (
        <input
          name={field.name}
          className="text-gray-500 rounded-sm px-2 w-16 text-md text-narrow"
          placeholder={field.title ?? field.name}
        />
      )

    case 'date':
    case 'text':
    default:
      return (
        <input
          name={field.name}
          className="text-white placeholder:text-gray-700  outline-none rounded-lg px-2 py-1 w-32 text-sm bg-white border border-gray-200 shadow-sm"
          placeholder={field.title ?? capitalize(field.name)}
        />
      )
  }
}

export const FilterBar: FC<Props> = ({ fields }) => {
  return (
    <div className="flex flex-grow items-center justify-left nowrap gap-2 px-4 py-3">
      {fields.map((field) => (
        <FilterField field={field} key={field.name} />
      ))}
    </div>
  )
}
