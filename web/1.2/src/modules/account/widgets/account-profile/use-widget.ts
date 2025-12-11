import { useAppSelector } from '@src/hooks'
import type { EntityEditWidgetSchema } from '@src/modules/general/components'

export function useWidget(props: EntityEditWidgetSchema): EntityEditWidgetSchema {
  const { account } = useAppSelector((state) => state.account)
  return { ...props, entity: account }
}
