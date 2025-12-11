import { CloudWatchLogsClient, PutLogEventsCommand, PutLogEventsCommandInput } from '@aws-sdk/client-cloudwatch-logs'
import { config } from '@src/config'
import { logger } from '@src/core'

let sequenceToken: string | undefined = undefined

export async function eventLog(type: string, message: string) {
  logger.debug(`Logging to CloudWatch ${config.cloudWatchLogPath}:${type}: ${message}`)
  const client = new CloudWatchLogsClient({ region: config.region })

  const [logGroupName, logStreamName] = config.cloudWatchLogPath.split(':')

  const params: PutLogEventsCommandInput = {
    logGroupName,
    logStreamName,
    logEvents: [
      {
        timestamp: Date.now(),
        message: `${type}: ${message}`,
      },
    ],
    sequenceToken: sequenceToken, // This is required after the first log event
  }

  const command = new PutLogEventsCommand(params)
  try {
    const data = await client.send(command)
    sequenceToken = data.nextSequenceToken
  } catch (err) {
    logger.error(`Failed to log to CloudWatch ${config.cloudWatchLogPath}:${(err as Error).message}`)
  }
}
