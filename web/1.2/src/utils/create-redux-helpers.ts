import { PayloadAction } from '@reduxjs/toolkit'

export function createReduxHelpers<T>() {
  /**
   * Sets a field or replaces the value entirely.
   * @param key
   * @returns
   */
  const set =
    <K extends keyof T>(key: K) =>
    (state: T, action: PayloadAction<T[K]>) => {
      state[key] = action.payload
    }

  /**
   * Shallow merges an object field.
   * @param key
   * @returns
   */
  const update =
    <K extends keyof T>(key: K) =>
    (state: T, action: PayloadAction<Partial<T[K]>>) => {
      const current = state[key]
      state[key] =
        typeof current === 'object' && current !== null ? { ...current, ...action.payload } : (action.payload as T[K])
    }

  /**
   * Pushes a new item into an array field.
   * @param key
   * @returns
   */
  const add =
    <K extends keyof T>(key: K) =>
    (state: T, action: PayloadAction<T[K] extends (infer U)[] ? U : never>) => {
      const array = state[key] as unknown[]
      array.push(action.payload as unknown)
    }

  /**
   * Removes an array element by its id.
   * @param key
   * @returns
   */
  const deleteItemById =
    <K extends keyof T>(key: K) =>
    (state: T, action: PayloadAction<number>) => {
      const array = state[key] as unknown[]
      state[key] = array.filter((item: unknown) => (item as { id: number }).id !== action.payload) as T[K]
    }

  /**
   * Updates an array element found by its id.
   * @param key
   * @returns
   */
  const updateItemById =
    <K extends keyof T>(key: K) =>
    (state: T, action: PayloadAction<Partial<T[K] extends (infer U)[] ? U : never> & { id: number }>) => {
      const array = state[key] as { id: number }[]
      const item = array.find((item) => item.id === action.payload.id)
      if (item) {
        Object.assign(item, action.payload)
      } else {
        throw new Error(`Redux Item Updater: item with ID ${action.payload.id} not found in ${String(key)}`)
      }
    }

  /**
   * Sets an item by its id.
   * @param key
   * @returns
   */
  const setItemById =
    <K extends keyof T>(key: K) =>
    (state: T, action: PayloadAction<Partial<T[K] extends (infer U)[] ? U : never> & { id: number }>) => {
      const array = state[key] as { id: number }[]
      const index = array.findIndex((item) => item.id === action.payload.id)
      if (index !== -1) {
        array[index] = action.payload
      } else {
        console.warn(`Redux Item Updater: item with ID ${action.payload.id} not found in ${String(key)}`)
      }
    }

  return {
    set,
    update,
    add,
    deleteItemById,
    updateItemById,
    setItemById,
  }
}
