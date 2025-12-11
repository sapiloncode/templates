import { initAuthConfig } from '@sapilon/api-auth'
import {
  SSM_PARAM_API_BASE_URL,
  SSM_PARAM_CORS_ALLOWED_ORIGINS,
  SSM_PARAM_DB_HOST,
  SSM_PARAM_DB_NAME,
  SSM_PARAM_DB_PASS,
  SSM_PARAM_DB_PORT,
  SSM_PARAM_DB_USER,
  SSM_PARAM_HOME_PAGE_URL,
  SSM_PARAM_TOKEN_SECRET,
} from '@src/constants'
import { logger } from '@src/core/logger'
import { getOrCreateAccount } from '@src/modules'
import { loadSsmParams } from '@src/utils'
import Joi from 'joi'

export type ConfigBase = {
  port: number
  env: string
  region: string
  ssmParams: Record<string, string>
  projectName: string
  apiBaseUri: string
  homePageUrl: string
  corsAllowedOrigins: string
  apiTextBodySizeLimit: string
  authTokenSecret: string
  serverTimeZone: number
  databaseUrl: string
  cloudWatchLogPath: string

  swagger: {
    title: string
    path: string
    explorer: boolean
    customCss: string
  }

  logging: {
    logApiRequest: boolean
    logApiResponse: boolean
    excludedPaths: string[]
  }
}

type EnvVars = {
  PROJECT_NAME: string
  AWS_REGION: string
  NODE_ENV: string
  PORT?: number
  API_BASE_URL?: string
  HOME_PAGE_URL?: string
  CORS_ALLOWED_ORIGINS?: string
  DATABASE_URL?: string
  TOKEN_SECRET?: string
} & NodeJS.ProcessEnv

export type BaseConfigContext = {
  config: ConfigBase
  envVars: EnvVars
  ssmParams: Record<string, string>
  prefix: string
}

const envVarsSchema = Joi.object()
  .keys({
    PROJECT_NAME: Joi.string().required(),
    AWS_REGION: Joi.string().required(),
    NODE_ENV: Joi.string().required(),
    PORT: Joi.number(),
    API_BASE_URL: Joi.string(),
    HOME_PAGE_URL: Joi.string(),
    CORS_ALLOWED_ORIGINS: Joi.string(),
    DATABASE_URL: Joi.string(),
    TOKEN_SECRET: Joi.string(),
  })
  .unknown()

export async function initBaseConfig(): Promise<BaseConfigContext> {
  logger.info('Initializing base config ...')

  const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env)

  if (error) {
    throw new Error(`Config validation error: ${error.message}`)
  }

  const env = envVars.NODE_ENV
  const region = envVars.AWS_REGION
  const prefix = `/${envVars.PROJECT_NAME}-${env}`

  const ssmParams = await loadSsmParams(region, prefix)

  const apiBaseUri: string = envVars.API_BASE_URL || ssmParams[SSM_PARAM_API_BASE_URL]

  const config: ConfigBase = {
    port: +envVars.PORT,
    env,
    region,
    ssmParams,
    projectName: envVars.PROJECT_NAME,
    apiBaseUri,
    homePageUrl: envVars.HOME_PAGE_URL || ssmParams[SSM_PARAM_HOME_PAGE_URL],
    corsAllowedOrigins: envVars.CORS_ALLOWED_ORIGINS || ssmParams[SSM_PARAM_CORS_ALLOWED_ORIGINS],
    apiTextBodySizeLimit: '1mb',
    authTokenSecret: envVars.TOKEN_SECRET || ssmParams[SSM_PARAM_TOKEN_SECRET],
    serverTimeZone: 0, // GMT+0
    databaseUrl: envVars.DATABASE_URL || '',
    swagger: {
      title: 'API Docs',
      path: '/api-docs',
      explorer: true,
      customCss: '',
    },
    logging: {
      logApiRequest: true,
      logApiResponse: true,
      excludedPaths: ['/version', '/health'],
    },
    cloudWatchLogPath: `${prefix}-api:app`,
  }

  if (!envVars.DATABASE_URL) {
    config.databaseUrl = `postgresql://${ssmParams[SSM_PARAM_DB_USER]}:${ssmParams[SSM_PARAM_DB_PASS]}@${
      ssmParams[SSM_PARAM_DB_HOST]
    }:${ssmParams[SSM_PARAM_DB_PORT]}/${ssmParams[SSM_PARAM_DB_NAME]}`
    process.env.DATABASE_URL = config.databaseUrl // for Prisma
  }

  await initAuthConfig(config, getOrCreateAccount)

  return {
    config,
    envVars,
    ssmParams,
    prefix,
  }
}
