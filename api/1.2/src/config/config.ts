import { logger } from '@src/core/logger' // Don't merge this import
import { ConfigBase, initBaseConfig } from './config.base'

type Config = ConfigBase & {
  // Add custom configuration here
}

export const config: Config = {} as Config

export async function initConfig() {
  if (Object.isFrozen(config)) {
    logger.warn('Config already initialized!')
    return
  }
  logger.info('Initializing config ...')

  try {
    const { config: baseConfig, envVars, ssmParams } = await initBaseConfig()

    const configInstance: Config = {
      ...baseConfig,

      // Add custom configuration here
    }

    Object.assign(config, configInstance)
    Object.freeze(config)
  } catch (error) {
    logger.error('Failed to initialize configuration:', error)
    throw error
  }
}
