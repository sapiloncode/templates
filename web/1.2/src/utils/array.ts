import isArray from 'lodash/isArray'

export function onlyUnique<T>(value: T, index: number, self: Array<T>): boolean {
  return self.indexOf(value) === index
}

export const isEmpty = (array: unknown[]) => array == null || array.length === 0

export function erase<T>(array: T[], value: T) {
  const newArray = [...array]
  const position = newArray.indexOf(value)
  if (position != -1) {
    newArray.splice(position, 1)
  }
  return newArray
}

export function append<T>(array: T[] | null | undefined, value: T) {
  return [...(array || []), value]
}

export const toggleItem = <T>(arr: T[], item: T) => {
  if (!arr || !isArray(arr)) return [item]
  return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]
}
