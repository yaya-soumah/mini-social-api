import { where } from 'sequelize'
import { PostRepository } from '../repositories/post.repository.js'
import { AppError } from '../utils/app-error.js'
import { getPagination } from '../utils/pagination.js'
import { Post } from '../models/post.model.js'
import { User } from '../models/user.model.js'

export class PostService {
  private static async getPostById(id: number) {
    const post = await PostRepository.getPostById(id)
    if (!post) throw new AppError('Post not found', 404)
    return post
  }

  static async getPost(id: number) {
    return this.getPostById(id)
  }

  static async createPost(data: any) {
    return PostRepository.createPost(data)
  }

  static async getPostsByUser(userId: number, query: any) {
    const { page, limit, offset } = await getPagination(query)
    const { posts, total } = await PostRepository.getPostsByUser(userId, limit, offset)
    return { total, page, posts }
  }

  static async updatePost(id: number, data: any) {
    const post = await this.getPostById(id)
    return post.update(data)
  }

  static async deletePost(id: number) {
    const post = await this.getPostById(id)
    return post.destroy()
  }

  static async createReply(authorId: number, content: string, parentId: number) {
    const parentPost = await this.getPostById(parentId)
    if (!parentPost) throw new AppError('Parent post not found', 404)

    return this.createPost({ authorId, content, parentId })
  }

  static async getAllReplies(parentId: number, query: any) {
    const { page, limit, offset } = await getPagination(query)
    const { posts, total } = await PostRepository.findAllReplies(parentId, limit, offset)
    return { total, page, posts }
  }

  static async fetchRepliesRecursive(postId: number, depth = 3) {
    const fetchLevel = async (parentIds: number[], currentDepth: number) => {
      if (!parentIds.length || currentDepth > depth) return []

      const replies = await Post.findAll({
        where: { parentId: parentIds },
        include: [{ model: User, attributes: ['id', 'username'] }],
        order: [['createdAt', 'ASC']],
      })

      const nestedReplies = await fetchLevel(
        replies.map((r) => r.id),
        currentDepth + 1
      )

      // Attach children to parents
      const replyMap: { [key: number]: any[] } = {}
      nestedReplies.forEach((reply) => {
        const parentId = reply.parentId!
        if (!replyMap[parentId]) replyMap[parentId] = []
        replyMap[parentId].push(reply)
      })

      return replies.map((reply) => ({
        ...reply.toJSON(),
        replies: replyMap[reply.id] || [],
      }))
    }

    return fetchLevel([postId], 1)
  }

  static async findAllPosts(page: number, limit: number, filters: any) {
    const { offset } = await getPagination({ page, limit })
    const { posts, total } = await PostRepository.findAllPosts(limit, offset, filters)
    return { posts, total, page, limit, totalPages: Math.ceil(total / limit) }
  }
}
