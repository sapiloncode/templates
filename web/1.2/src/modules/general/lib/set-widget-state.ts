import { AppContext } from '@src/types'
import { widgetStateSet } from '../state'

export function setWidgetState<STATE>(cn: AppContext, props: Partial<STATE>) {
  cn.dispatch(widgetStateSet({ href: cn.href, props }))
}
