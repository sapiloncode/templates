import { openapi } from '@api'
import { authMiddleware } from '@sapilon/api-auth'
import packageJson from '@src/../package.json'
import { figlet } from '@src/assets/figlet'
import { config } from '@src/config'
import { ENVIRONMENT_DEVELOPMENT } from '@src/constants'
import { db } from '@src/core'
import { eventLog } from '@src/utils/aws/event-log'
import compression from 'compression'
import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import { middleware as OpenApiValidator } from 'express-openapi-validator'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import http from 'http'
import morgan from 'morgan'
import sourceMapSupport from 'source-map-support'
import swaggerUi from 'swagger-ui-express'
import { createRouter } from './create-router'
import { logMemory } from './log-memory'
import { logger } from './logger'
import { setupSocket } from './setup-socket'

export async function createApp(): Promise<express.Application> {
  logger.debug(`Starting API server [${packageJson.version}] ...`)

  try {
    await db.$connect()
    logger.info('Database connection established!')
  } catch (error) {
    logger.error('Failed to connect to database:', error)
    throw error
  }

  const app = express()

  // ───────────────────────────────────────────────
  // 1️⃣ Setup (source maps, JSON parsing, compression)
  // ───────────────────────────────────────────────
  sourceMapSupport.install({ handleUncaughtExceptions: true })
  app.disable('x-powered-by') // Hide Express fingerprint
  app.use(express.json({ limit: '5mb' }))
  app.use(express.urlencoded({ extended: true }))
  app.use(compression())

  // ───────────────────────────────────────────────
  // 2️⃣ Logging — place *before* CORS & auth to capture full traffic
  // ───────────────────────────────────────────────
  app.use(
    morgan(
      (tokens, req, res) => {
        const msg = [
          `→ [${tokens.method(req, res)}] ${tokens.url(req, res)}`,
          `${tokens.status(req, res)} - ${tokens['response-time'](req, res)} ms`,
          `(${req.ip})`,
        ].join(' ')
        logger.debug(msg)
        return ''
      },
      {
        skip: (req) => {
          return config.logging?.excludedPaths?.includes(req.path) ?? false
        },
      }
    )
  )

  // ───────────────────────────────────────────────
  // 3️⃣ Security headers — must run *before* routes
  // ───────────────────────────────────────────────
  app.use(helmet())
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: config.env === ENVIRONMENT_DEVELOPMENT ? 10000 : 100, // limit each IP to 100 requests per windowMs
    })
  )

  // ───────────────────────────────────────────────
  // 4️⃣ CORS — apply early, before any route or auth
  // ───────────────────────────────────────────────
  app.use(
    cors({
      origin: config.corsAllowedOrigins || '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  )

  // ───────────────────────────────────────────────
  // 5️⃣ Authentication — after parsing, before validation
  // ───────────────────────────────────────────────
  app.use(authMiddleware(openapi, config.authTokenSecret) as any)

  // ───────────────────────────────────────────────
  // 6️⃣ Validation — before routes
  // ───────────────────────────────────────────────
  app.use(
    OpenApiValidator({
      apiSpec: openapi as any,
      validateRequests: true,
      validateResponses: false,
      ignoreUndocumented: true,
      coerceTypes: true,
    })
  )

  // ───────────────────────────────────────────────
  // 7️⃣ Swagger UI — served *after* security but before routes
  // ───────────────────────────────────────────────
  if (config.swagger.explorer) {
    app.use(
      config.swagger.path,
      swaggerUi.serve,
      swaggerUi.setup(openapi, {
        explorer: config.swagger.explorer ?? true,
        customSiteTitle: config.swagger.title,
        customCss: config.swagger.customCss,
      })
    )
  }

  // ───────────────────────────────────────────────
  // 8️⃣ Dynamic Routes
  // ───────────────────────────────────────────────
  const router = createRouter(openapi)
  app.use(router)

  // ───────────────────────────────────────────────
  // 9️⃣ Error handling (always last)
  // ───────────────────────────────────────────────
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || 500
    logger.error('❌ Unhandled error:', err)
    res.status(status).json({
      success: false,
      status,
      message: err.message ?? 'Internal server error',
      ...(config.env === ENVIRONMENT_DEVELOPMENT && { stack: err.stack }),
    })
  })

  // ───────────────────────────────────────────────
  // 🔟 HTTP Server & WebSocket (Socket.IO)
  // ───────────────────────────────────────────────
  const server = http.createServer(app)
  setupSocket(server)

  server.listen(config.port, '0.0.0.0', async () => {
    logger.info(`Server [${packageJson.version}] started on http://127.0.0.1:${config.port}`)

    try {
      await eventLog('START', `Version: ${packageJson.version} Url: ${config.apiBaseUri}`)
    } catch (error) {
      logger.warn('Failed to log startup event:', error)
    }

    console.debug(figlet)
    logMemory()
  })

  return app
}
