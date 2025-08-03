import 'reflect-metadata'
import { config } from 'dotenv'

import logger from './config/logger'
import sequelize, { setupModels } from './config/database'
import { connection as redisConnection } from './queues/notificationQueue'
import app from './app'

config()

const PORT = process.env.PORT || 8080

async function startServer() {
  try {
    await sequelize.authenticate()
    setupModels(sequelize)

    logger.info('Database connected successfully')

    if (process.env.NODE_ENV !== 'production') {
      if (redisConnection?.status === 'ready') {
        logger.info('Redis connected for background jobs')
      } else {
        logger.error('Redis is not connected or unavailable')
      }
    }

    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}/api/v1`)
    })
  } catch (error) {
    logger.error('Failed to start:', error)
  }
}

startServer()
