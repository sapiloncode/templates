export async function checkIconsAvailability(): Promise<boolean> {
  if (!('fonts' in document)) {
    console.debug('Font loading API not available')
    return false
  }

  try {
    await document.fonts.load('1em Material Symbols Outlined')
    return true
  } catch (error) {
    console.error('Font is not available', error)
    return false
  }
}
