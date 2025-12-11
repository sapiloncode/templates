import { ConfigBase, initBaseConfig } from './config.base'

type Config = ConfigBase & {
  // Add custom config here
}

export const config: Config = {} as Config

export function initConfig() {
  if (Object.isFrozen(config)) {
    console.debug('Config already initialized!')
    return
  }
  console.debug('Initializing config ...')

  try {
    const baseConfig = initBaseConfig()

    const configInstance: Config = {
      ...baseConfig,
      // Add custom config here
    }

    Object.assign(config, configInstance)
    Object.freeze(config)
  } catch (error) {
    console.error('Failed to initialize configuration:', error)
    throw error
  }
}
