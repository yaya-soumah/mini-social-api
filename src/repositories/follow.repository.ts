import { User } from '../models/user.model.js'
import { AppError } from '../utils/app-error.js'

export class FollowRepository {
  static async followUser(followerId: number, followingId: number) {
    const follower = await User.findByPk(followerId)
    const following = await User.findByPk(followingId)

    if (!follower || !following) throw new AppError('User not found')

    const isAlreadyFollowing = await follower.$has('following', following)
    if (isAlreadyFollowing) {
      throw new AppError('Already following this user', 400)
    }

    await follower.$add('following', following)
  }

  static async unFollowUser(followerId: number, followingId: number) {
    const follower = await User.findByPk(followerId)
    const following = await User.findByPk(followingId)

    if (!follower || !following) throw new AppError('User not found')

    const isAlreadyFollowing = await follower.$has('following', following)
    if (!isAlreadyFollowing) {
      throw new AppError('You are not following this user', 400)
    }

    await follower.$remove('following', following)
  }

  static async getFollowers(userId: number, limit: number, offset: number) {
    const { count, rows } = await User.findAndCountAll({
      where: { id: userId },
      include: [
        {
          model: User,
          as: 'followers',
          attributes: ['id', 'username', 'avatar', 'bio'],
        },
      ],
      limit,
      offset,
      attributes: ['id', 'username', 'avatar', 'bio'],
    })
    return { followers: rows, total: count }
  }

  static async getFollowing(userId: number, limit: number, offset: number) {
    const { count, rows } = await User.findAndCountAll({
      where: { id: userId },
      include: [
        {
          model: User,
          as: 'following',
          attributes: ['id', 'username', 'avatar', 'bio'],
          through: { attributes: [] },
        },
      ],
      offset,
      limit,
      attributes: ['id', 'username', 'avatar', 'bio'],
    })

    return { following: rows, total: count }
  }
}
