import { enqueueNotification } from '../jobs/addNotificationJob.js'
import { Follow } from '../models/follow.model.js'
import { User } from '../models/user.model.js'
import { FollowRepository } from '../repositories/follow.repository.js'
import { UserRepository } from '../repositories/user.repository.js'
import { AppError } from '../utils/app-error.js'
import { getPagination } from '../utils/pagination.js'

export class FollowService {
  static async follow(followerId: number, followingId: number) {
    if (followerId === followingId) throw new AppError('You cannot follow yourself', 400)
    await FollowRepository.followUser(followerId, followingId)
    // send notification on follow
    const follower = await UserRepository.findUserById(followerId)

    await enqueueNotification({
      recipientId: followingId,
      type: 'follow',
      message: `${follower!.username} followed you`,
      metadata: { followerId },
    })
    return FollowRepository.followUser(followerId, followingId)
  }

  static async unfollow(followerId: number, followingId: number) {
    if (followerId === followingId)
      throw new AppError('You cannot follow or unfollow yourself', 400)
    return FollowRepository.unFollowUser(followerId, followingId)
  }

  static async getFollowers(userId: number, query: any) {
    const { page, limit, offset } = await getPagination(query)
    const user = await UserRepository.findUserById(userId)
    if (!user) throw new AppError('user not founf', 404)
    const { followers, total } = await FollowRepository.getFollowers(userId, limit, offset)
    return { total, page, followers }
  }

  static async getFollowing(userId: number, query: any) {
    const { page, limit, offset } = await getPagination(query)
    const user = await UserRepository.findUserById(userId)

    if (!user) throw new AppError('user not found', 404)
    const { following, total } = await FollowRepository.getFollowing(userId, limit, offset)
    return { following, total, page }
  }
}
