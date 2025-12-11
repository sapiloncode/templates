import { DataTable, FilterBar, WidgetComponent } from '@src/components'
import type { WidgetComponentProps } from '@src/modules'
import { navigate } from '@src/modules'
import { loadEntityItems } from '@src/modules/entity/lib/load-entity-items'
import type { Entity, FieldSchema } from '@src/types'
import { FC, useEffect } from 'react'
import { useEntityListSelector } from './use-entity-list-selector'

type Props = {
  fields: FieldSchema[]
  filterFields: FieldSchema[]
  entityName: string
}

export type DataTableWidgetSchema = Props & WidgetComponentProps<Props>

export const DataTableWidget: FC<DataTableWidgetSchema> = ({ cn, fields, filterFields, entityName, ...props }) => {
  const { list } = useEntityListSelector(entityName)

  useEffect(() => {
    loadEntityItems(cn, entityName)
  }, [entityName, cn])

  function onSelect(item: Entity) {
    navigate(cn, '/' + entityName + '/' + item.id)
  }

  // function handleAdd() {
  //   navigate(cn, '/' + entityName + '/new')
  // }

  return (
    <WidgetComponent cn={cn} {...props}>
      <div className="bg-white pb-12 pt-2">
        <FilterBar fields={filterFields} />
        <DataTable items={list} fields={fields} onSelect={onSelect} />
      </div>
    </WidgetComponent>
  )
}
