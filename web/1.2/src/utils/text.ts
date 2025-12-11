export function camelCaseToTitleCase(camelCase: string) {
  // Step 1: Split camelCase into words
  const words = camelCase.replace(/([A-Z])/g, ' $1').trim()

  // Step 2: Capitalize the first letter of each word
  const titleCase = words
    .toLowerCase()
    .replace(/^./, (str) => str.toUpperCase())
    .replace(/ (\w)/g, (str) => str.toUpperCase())

  return titleCase
}

export const trimSlash = (path: string) => path.replace(/^\/|\/$/g, '')
