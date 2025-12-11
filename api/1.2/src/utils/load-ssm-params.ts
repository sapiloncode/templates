import { GetParametersByPathCommand, SSMClient } from '@aws-sdk/client-ssm'
import { logger } from '@src/core/logger'

export async function loadSsmParams(region: string, prefix: string): Promise<Record<string, string>> {
  logger.debug('Loading SSM params for region: ' + region + ' prefix: ' + prefix + ' ...')

  const client = new SSMClient({ region })
  let nextToken: string | undefined
  const results: Record<string, string> = {}

  do {
    const command = new GetParametersByPathCommand({
      Path: prefix,
      Recursive: true,
      WithDecryption: true,
    })

    if (nextToken) command.input.NextToken = nextToken

    const response = await client.send(command)

    response.Parameters?.forEach((p) => {
      // Remove prefix for cleaner keys
      const key = p.Name!.replace(prefix + '/', '')
      results[key] = p.Value!
    })

    nextToken = response.NextToken
  } while (nextToken)

  return results
}
