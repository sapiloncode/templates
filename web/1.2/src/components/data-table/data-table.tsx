import { Entity, FieldSchema } from '@src/types'
import { camelCaseToTitleCase } from '@src/utils'
import { FC, useState } from 'react'

type Props = {
  fields: FieldSchema[]
  items: Entity[]
  onSelect: (item: Entity) => void
}

export const DataTable: FC<Props> = ({ onSelect, fields, items }) => {
  const [selected, setSelected] = useState<Entity | null>(null)

  function getValue(item: Entity, field: FieldSchema) {
    const value = item[field.name]
    if (value == null || value == '') return '-'
    return String(value)
  }

  function select(item: Entity) {
    setSelected(item)
    onSelect(item)
  }

  return (
    <table className="w-full">
      <thead>
        <tr>
          {fields.map((field, index) => (
            <th
              key={field.name}
              className={`bg-blue-200 text-left min-w-28 px-2 py-3 font-semibold text-sm tracking-wider ${
                index === 0 ? 'pl-4' : 'border-l border-white'
              }`}
            >
              {field.title ?? camelCaseToTitleCase(field.name)}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {items.map((item) => (
          <tr
            key={item.id}
            onClick={() => select(item)}
            className={`border-b hover:bg-gray-100/40 ${selected == item ? 'bg-gray-100' : 'bg-transparent'}`}
          >
            {fields.map((field, index) => (
              <td
                className={`px-2 py-3 font-normal text-sm text-gray-900 cursor-pointer ${index === 0 ? 'pl-4' : ''}`}
                key={field.name}
              >
                {getValue(item, field)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
