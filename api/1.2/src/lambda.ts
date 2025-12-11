import serverlessExpress from '@codegenie/serverless-express'
import { initConfig } from '@src/config'
import { APIGatewayProxyEvent, Context } from 'aws-lambda'

let cachedHandler: any = null

export const handler = async (event: APIGatewayProxyEvent, context: Context) => {
  if (!cachedHandler) {
    try {
      await initConfig()
      const { createApp } = await import('./core/create-app')
      const app = await createApp()
      cachedHandler = serverlessExpress({ app })
    } catch (error) {
      console.error('Failed to initialize Lambda handler:', error)
      throw error
    }
  }

  return cachedHandler(event, context)
}
