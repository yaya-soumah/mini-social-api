import { enqueueNotification } from '../jobs/addNotificationJob.js'
import { Like } from '../models/like.model.js'
import { Post } from '../models/post.model.js'
import { User } from '../models/user.model.js'
import { AppError } from '../utils/app-error.js'

export class likeService {
  static async toggleLike(userId: number, postId: number) {
    const existing = await Like.findOne({ where: { userId, postId }, include: [User, Post] })

    if (existing) {
      existing.active = !existing.active
      await existing.save()
      // send notification if like
      const authorId = existing.post.authorId
      const username = existing.user.username
      if (existing.active && authorId != userId) {
        await enqueueNotification({
          recipientId: authorId,
          type: 'like',
          message: `${username} liked your post`,
        })
      }
      return { liked: existing.active }
    }

    await Like.create({ userId, postId, active: true })
    return { liked: true }
  }

  static async getLikeCount(postId: number) {
    return Like.count({ where: { postId, active: true } })
  }

  static async getPostLikers(postId: number) {
    return Like.findAll({
      where: { postId, active: true },
      include: [{ association: Like.associations.user, attributes: ['id', 'username'] }],
    })
  }
}
