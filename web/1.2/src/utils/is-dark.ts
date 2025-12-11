type ThemePreference = 'dark' | 'light' | 'system'

export function isDark(theme: ThemePreference): boolean {
  const query = window.matchMedia('(prefers-color-scheme: dark)')
  return theme === 'system' ? query.matches : theme === 'dark'
}
