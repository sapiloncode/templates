import { useAppSelector } from '@src/hooks'
import { EntityListState } from '@src/types'

export const useEntityListSelector = (name: string) =>
  useAppSelector<EntityListState>((state) => {
    const value = (state as unknown as Record<string, EntityListState>)[name]
    if (!value) {
      console.log(`Reducer '${name}' not found!`)
    }
    return value
  })
