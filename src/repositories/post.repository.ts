import { Op } from 'sequelize'

import { Post } from '../models/post.model.js'
import { User } from '../models/user.model.js'

export class PostRepository {
  static async createOne(data: {
    content: string
    authorId: number
    parentId?: number
    mediaUrl?: string
  }) {
    return await Post.create(data)
  }

  static async findAllByUser(
    authorId: number,
    limit: number,
    offset: number,
    filters?: { q?: string },
  ) {
    const where: any = {}
    where.authorId = authorId
    if (filters?.q) where.content = { [Op.like]: `%${filters.q.toLocaleLowerCase()}%` }

    const { rows, count } = await Post.findAndCountAll({
      where,
      include: [{ model: User, attributes: ['id', 'username', 'avatar'] }],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    })
    return { posts: rows, total: count }
  }
  static async findAll(limit: number, offset: number, filters?: { authorId?: number; q?: string }) {
    const where: any = {}
    if (filters?.authorId) where.authorId = filters.authorId
    if (filters?.q) where.content = { [Op.like]: `%${filters.q.toLocaleLowerCase()}%` }

    const { rows, count } = await Post.findAndCountAll({
      where,
      include: [{ model: User, attributes: ['id', 'username', 'avatar'] }],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    })
    return { posts: rows, total: count }
  }

  static async getOneById(id: number) {
    return (await Post.findByPk(id)) || null
  }

  static async updateOne(id: number, data: any) {
    const post = await Post.findByPk(id)
    if (!post) return null
    post.update(data)
    return post.save()
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
}
