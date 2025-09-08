import { Worker } from 'bullmq'

import { connection } from '../queues/notificationQueue.js'
import sequelize, { setupModels } from '../config/database'
import { Notification } from '../models'
import logger from '../config/logger.js'

async function initializeWorker() {
  try {
    await sequelize.authenticate()
    setupModels(sequelize)
    logger.info('Sequelize initialized in worker')

    const worker = new Worker(
      'notifications',
      async (job) => {
        const { recipientId, type, message } = job.data

        await Notification.create({
          recipientId,
          type,
          message,
        })
        console.log(`Notification created for user ${recipientId}`)
      },
      { connection },
    )
    console.log('Notification worker is running...')

    worker.on('failed', (job, err) => {
      console.error(`Job failed: ${job?.id}`, err)
    })

    async function shutdownWorker() {
      console.log('\nShutting down worker...')
      await worker.close()
      if (connection) {
        await connection.quit()
      }
      console.log('Worker stopped gracefully')
      process.exit(0)
    }

    // Handle process signals
    process.on('SIGINT', shutdownWorker)
    process.on('SIGTERM', shutdownWorker)
  } catch (error) {
    console.error('Failed to initialize worker Sequelize connection:', error)
    process.exit(1)
  }
}

// Start the worker
initializeWorker()
