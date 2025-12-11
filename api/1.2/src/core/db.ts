import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient | null = null

export const db = new Proxy(
  {},
  {
    get(_, prop: keyof PrismaClient) {
      if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL not set before Prisma initialization')
      }
      if (!prisma) {
        prisma = new PrismaClient()
      }
      // @ts-ignore — dynamic proxy type
      return prisma[prop]
    },
  }
) as unknown as PrismaClient
