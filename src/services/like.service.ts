import { enqueueNotification } from '../jobs/addNotificationJob.js'
import { Like } from '../models/like.model.js'
import { Post } from '../models/post.model.js'
import { User } from '../models/user.model.js'
import { LikeRepository } from '../repositories/like.repository.js'

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

    await LikeRepository.createOne(userId, postId, true)
    return { liked: true }
  }

  static async getLikeCount(postId: number) {
    return LikeRepository.findLikeCount(postId)
  }

  static async getPostLikers(postId: number) {
    return LikeRepository.findPostLikers(postId)
  }
}
