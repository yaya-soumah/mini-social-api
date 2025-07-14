import { Queue } from 'bullmq'
import IORedis from 'ioredis'
import { config } from 'dotenv'

config()

export const connection = new IORedis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
})

export const notificationQueue = new Queue('notifications', {
  connection,
})
