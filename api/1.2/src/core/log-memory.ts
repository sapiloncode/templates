import { logger } from './logger'

export function logMemory() {
  const usage = process.memoryUsage()
  const heapUsed = (usage.heapUsed / 1024 / 1024).toFixed(2)
  const heapTotal = (usage.heapTotal / 1024 / 1024).toFixed(2)
  const rss = (usage.rss / 1024 / 1024).toFixed(2)

  logger.warn(`Memory Usage - Heap: ${heapUsed} MB / ${heapTotal} MB, RSS: ${rss} MB`)
}
