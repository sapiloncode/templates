import { ENVIRONMENT_DEVELOPMENT } from '@src/constants'
import winston from 'winston'

const isDev = process.env.NODE_ENV === ENVIRONMENT_DEVELOPMENT

export const logger = winston.createLogger({
  level: 'debug',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        ...(isDev ? [winston.format.colorize({ all: true })] : []),
        winston.format.simple()
      ),
    }),
  ],
})
