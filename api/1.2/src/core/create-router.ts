import { handlers, HttpResponse, HttpStatus } from '@api'
import express, { Request, Response } from 'express'
import { OpenAPI } from 'openapi-types'
import { match } from 'path-to-regexp'
import { logger } from './logger'

/**
 * Initializes an Express router that dynamically maps OpenAPI paths to handler modules.
 */
export function createRouter(openapi: OpenAPI.Document) {
  const router = express.Router()
  const SUPPORTED_METHODS = ['get', 'post', 'put', 'patch', 'delete'] as const

  // Precompute path matchers once for performance
  const matchers = Object.entries(openapi.paths || {}).flatMap(([apiPath, item]) =>
    SUPPORTED_METHODS.filter((method) => item?.[method])
      .map((method) => {
        try {
          return {
            method,
            apiPath,
            operationId: item?.[method]?.operationId,
            matcher: match(apiPath.replace(/{([^}]+)}/g, ':$1')), // convert OpenApi path to Express path
          }
        } catch (error) {
          console.error(`Error creating matcher for path: ${apiPath}`, error)
          return null
        }
      })
      .filter((matcher): matcher is NonNullable<typeof matcher> => matcher !== null)
  )

  function findPath(method: string, requestPath: string) {
    const m = method.toLowerCase()
    for (const { method: definedMethod, operationId, apiPath, matcher } of matchers) {
      if (definedMethod !== m) continue
      const matched = matcher(requestPath)
      if (matched) return { operationId, apiPath, pathParams: matched.params }
    }
    return null
  }

  function convertParamValue(value: any): any {
    if (typeof value !== 'string') return value

    // Convert boolean strings
    if (value.toLowerCase() === 'true') return true
    if (value.toLowerCase() === 'false') return false

    // Convert numeric strings
    const numValue = Number(value)
    if (!isNaN(numValue) && value.trim() !== '') {
      return numValue
    }

    return value
  }

  function convertParams(params: Record<string, any>): Record<string, any> {
    const converted: Record<string, any> = {}
    for (const [key, value] of Object.entries(params)) {
      converted[key] = convertParamValue(value)
    }
    return converted
  }

  // Catch-all route for all API requests defined in OpenAPI
  router.use(async (req: Request, res: Response) => {
    try {
      const found = findPath(req.method, req.path)
      if (!found) {
        logger.warn(`No handler found for ${req.method} ${req.path}`)
        if (!res.headersSent) {
          return res.status(HttpStatus.NOT_FOUND).send(`No handler found for ${req.method} ${req.path}`)
        }
        return
      }

      const { operationId, pathParams } = found

      const request = {
        path: req.path,
        method: req.method,
        body: req.body,
        query: req.query,
        headers: req.headers,
        user: req.user,
        params: convertParams({ ...req.params, ...req.query, ...pathParams }),
      }

      if (!operationId) {
        if (!res.headersSent) {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(`No operationId found for ${req.method} ${req.path}`)
        }
        return
      }

      // @ts-ignore
      const handler = handlers[operationId]
      if (typeof handler !== 'function') {
        if (!res.headersSent) {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .send(`Handler ${operationId} must export a default function`)
        }
        return
      }

      const response = await handler(request)

      if (res.headersSent) return

      if (response?.__httpResponse) {
        if (response.redirectUrl) {
          logger.debug(`Redirecting to ${response.redirectUrl}`)
          return res.status(response.status).location(response.redirectUrl).send(response.body)
        } else {
          return res.status(response.status).send(response.body)
        }
      } else {
        return res.status(200).json(response)
      }
    } catch (error) {
      logger.error('Router error:', error)
      if (!res.headersSent) {
        const response = new HttpResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal server error')
        res.status(response.status).send(response.body)
      }
    }
  })

  return router
}
