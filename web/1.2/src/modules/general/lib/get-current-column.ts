import { AppContext } from '@src/types'

export function getCurrentColumn(cn: AppContext) {
  const {
    general: { columns },
  } = cn.getState()
  return columns.findIndex(({ href }) => href === cn.href)
}
