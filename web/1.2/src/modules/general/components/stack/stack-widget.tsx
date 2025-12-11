import { WidgetComponent } from '@src/components'
import type { WidgetComponentProps } from '@src/modules'
import { FC } from 'react'

type Props = {
  items: WidgetComponentProps[]
}

export type StackWidgetSchema = WidgetComponentProps<Props> & Props

export const StackWidget: FC<StackWidgetSchema> = ({ cn, items, ...props }) => {
  return (
    <WidgetComponent cn={cn} {...props}>
      <div className="flex flex-col pt-4 pb-12 px-2">
        {items.map((item) => (
          <WidgetComponent children={''} key={item.name} cn={cn} {...item} />
        ))}
      </div>
    </WidgetComponent>
  )
}
