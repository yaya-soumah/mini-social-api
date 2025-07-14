import { Op } from 'sequelize'
import { Post } from '../models/post.model.js'
import { User } from '../models/user.model.js'

export class PostRepository {
  static async createPost(data: {
    content: string
    authorId: number
    parentId?: number
    mediaUrl?: string
  }) {
    return await Post.create(data)
  }

  static async getPostsByUser(userId: number, limit = 10, offset = 0) {
    const { count, rows } = await Post.findAndCountAll({
      where: { authorId: userId },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    })
    return { posts: rows, total: count }
  }

  static async getPostById(id: number) {
    return await Post.findByPk(id)
  }

  static async findAllReplies(parentId: number, limit = 10, offset = 0) {
    const { count, rows } = await Post.findAndCountAll({
      where: { parentId },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    })
    return { posts: rows, total: count }
  }

  static async findAllPosts(
    limit: number,
    offset: number,
    filters: { authorId?: number; keyword?: string }
  ) {
    const where: any = {}
    if (filters.authorId) where.authorId = filters.authorId
    if (filters.keyword) where.content = { [Op.iLike]: `%${filters.keyword}` }

    const { rows, count } = await Post.findAndCountAll({
      where,
      include: [{ model: User, attributes: ['id', 'username', 'avatar'] }],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    })
    return { posts: rows, total: count }
  }
}
