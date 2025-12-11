import { OpenAPI } from 'openapi-types'

export function findOpenApiOperation(openapi: OpenAPI.Document, method: string, reqPath: string) {
  for (const [pathPattern, pathItem] of Object.entries(openapi.paths as Record<string, any>)) {
    const regex = new RegExp('^' + pathPattern.replace(/{[^}]+}/g, '[^/]+') + '$')
    if (regex.test(reqPath)) {
      return pathItem[method]
    }
  }
  return null
}
