import { notificationQueue } from '../queues/notificationQueue.js'
import logger from '../config/logger'

type NotificationPayload = {
  recipientId: number
  message: string
  type: 'like' | 'follow'
  metadata?: any
}

export async function enqueueNotification(data: NotificationPayload) {
  if (notificationQueue) {
    await notificationQueue.add('notify', data)
    logger.info('notification sent')
  } else {
    logger.info('Notification skipped — no queue available (prod)')
  }
}
