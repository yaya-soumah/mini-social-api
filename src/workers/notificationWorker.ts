import { Worker } from 'bullmq'
import { connection } from '../queues/notificationQueue.js'
import { Notification } from '../models/notification.model.js'

const worker = new Worker(
  'notifications',
  async (job) => {
    const { recipientId, type, message, metadata } = job.data

    await Notification.create({
      recipientId,
      type,
      message,
    })

    console.log(`Notification created for user ${recipientId}`)
  },
  { connection }
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
  console.log('Worker stopped')
  process.exit(0)
}

// Handle process signals
process.on('SIGINT', shutdownWorker)
process.on('SIGTERM', shutdownWorker)
