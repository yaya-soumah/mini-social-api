import { Like } from '../models/like.model.js'

export class LikeRepository {
  static async findOne(userId: number, postId: number) {
    return Like.findOne({
      where: {
        userId,
        postId,
      },
    })
  }

  static async createOne(userId: number, postId: number, active: boolean) {
    Like.create({ userId, postId, active })
  }

  static async findLikeCount(postId: number) {
    return Like.count({ where: { postId, active: true } })
  }

  static async findPostLikers(postId: number) {
    return Like.findAll({
      where: { postId, active: true },
      include: [{ association: Like.associations.user, attributes: ['id', 'username'] }],
    })
  }
}
