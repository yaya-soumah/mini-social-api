import { notificationQueue } from '../queues/notificationQueue.js'

type NotificationPayload = {
  recipientId: number
  message: string
  type: 'like' | 'follow'
  metadata?: any
}

export async function enqueueNotification(data: NotificationPayload) {
  if (notificationQueue) {
    await notificationQueue.add('notify', data)
    console.log('notification sent')
  } else {
    console.log('Notification skipped — no queue available (prod)')
  }
}
