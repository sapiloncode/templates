export function localStorageWrite(key: string, value: unknown) {
  if (value == null) {
    localStorage.removeItem(key)
  } else {
    localStorage.setItem(key, String(value))
  }
}
