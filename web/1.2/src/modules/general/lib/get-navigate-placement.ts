import { NavigatePlacement } from '@src/types'

export function getNavigatePlacement(url: string): NavigatePlacement {
  const [, placement] = url.split('#')
  if (placement) {
    return placement as NavigatePlacement
  }

  if (url === '') return 'close'
  else if (url.startsWith('/')) return 'first'
  else return 'next'
}
