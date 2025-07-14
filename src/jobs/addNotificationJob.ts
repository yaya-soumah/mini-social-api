import { notificationQueue } from '../queues/notificationQueue.js'

export async function enqueueNotification(data: {
  recipientId: number
  type: 'like' | 'follow'
  message: string
  metadata?: any
}) {
  await notificationQueue.add('notify', data)
}
