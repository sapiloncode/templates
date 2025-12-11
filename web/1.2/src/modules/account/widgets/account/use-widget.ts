import brandDark from '@src/assets/images/brand-dark.png'
import brandLight from '@src/assets/images/brand-light.png'
import { useAppSelector } from '@src/hooks'
import type { ListWidgetSchema } from '@src/modules/general/components'

export function useWidget(props: ListWidgetSchema): ListWidgetSchema {
  const isDark = useAppSelector((state) => state.general.isDark)
  const items = props.items.map((item) => {
    if (item.id === 'brand') {
      return { ...item, image: isDark ? brandDark : brandLight }
    } else {
      return item
    }
  })
  return { ...props, items }
}
