import { enqueueNotification } from '../jobs/addNotificationJob.js'
import { FollowRepository } from '../repositories/follow.repository.js'
import { UserRepository } from '../repositories/user.repository.js'
import { AppError } from '../utils/app-error.js'
import { getPagination } from '../utils/pagination.js'
import { FollowType } from '../validators/follow.schema.js'

export class FollowService {
  static async follow({ followerId, followingId }: FollowType) {
    if (followerId === followingId) throw new AppError('You cannot follow yourself', 400)

    const follower = await UserRepository.findOneById(followerId)

    // send notification on follow
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
    const user = await UserRepository.findOneById(userId)
    if (!user) throw new AppError('user not found', 404)

    const { followers, total } = await FollowRepository.getFollowers(userId, limit, offset)
    return { total, page, followers }
  }

  static async getFollowing(userId: number, query: any) {
    const { page, limit, offset } = await getPagination(query)
    const user = await UserRepository.findOneById(userId)
    if (!user) throw new AppError('user not found', 404)

    const { following, total } = await FollowRepository.getFollowing(userId, limit, offset)
    return { following, total, page }
  }
}
