import { Request, Response } from 'express'

import { PostService } from '../services/post.service.js'
import { AppError } from '../utils/app-error.js'
import { error, success } from '../utils/response.js'
import { connection } from '../queues/notificationQueue.js'
import { getPagination } from '../utils/pagination.js'

export const createPost = async (req: Request, res: Response) => {
  try {
    const authorId = (req as any).user.id
    const data = { authorId, ...req.body }
    const post = await PostService.createPost(data)
    if (!post) throw new AppError('Post not created', 400)
    success(res, 201, post, 'post created successfully')
  } catch (err) {
    error(res, (err as AppError).statusCode, (err as AppError).message)
  }
}

export const listPostsByUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    const posts = await PostService.getAllByUser(userId, req.query)
    success(res, 200, posts, 'Operation successful')
  } catch (err) {
    error(res, (err as AppError).statusCode, (err as AppError).message)
  }
}

export const getPaginatedGlobalPosts = async (req: Request, res: Response) => {
  try {
    const { page, limit, offset, filters } = await getPagination(req.query)

    const { authorId, q } = filters

    const cacheKey = `timeline: page:${page}:limit:${limit}:authorId:${authorId}:keyword:${q}`
    const cached = await connection.get(cacheKey)

    if (cached) {
      success(res, 200, cached, 'Operation successful')
    }

    const result = await PostService.findAllPosts({ page, limit, offset, filters })

    await connection.set(cacheKey, JSON.stringify(result), 'EX', 60)

    success(res, 200, result, 'Operation successful')
  } catch (err) {
    error(res, (err as AppError).statusCode, (err as AppError).message)
  }
}

export const getPost = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)

    const post = await PostService.getPostById(id)
    success(res, 200, post, 'Operation successful')
  } catch (err) {
    error(res, (err as AppError).statusCode, (err as AppError).message)
  }
}

export const updatePost = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    const post = await PostService.updatePost(id, req.body)
    success(res, 200, post, 'post updated')
  } catch (err) {
    error(res, (err as AppError).statusCode, (err as AppError).message)
  }
}

export const deletePost = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    const userId = (req as any).user.id
    await PostService.deletePost(id, userId)
    success(res, 204, {}, 'Post deleted successfully')
  } catch (err) {
    error(res, (err as AppError).statusCode, (err as AppError).message)
  }
}

export const replyToPost = async (req: Request, res: Response) => {
  try {
    const id = (req as any).user.id
    const { parentId } = req.params
    const { content } = req.body

    const reply = await PostService.createReply(id, content, Number(parentId))
    success(res, 201, reply, 'Operation successful')
  } catch (err) {
    error(res, (err as AppError).statusCode, (err as AppError).message)
  }
}

export const getReplies = async (req: Request, res: Response) => {
  try {
    const parentId = parseInt(req.params.parentId)
    const replies = await PostService.getAllReplies(parentId, req.query)
    success(res, 200, replies, 'Operation successful')
  } catch (err) {
    error(res, (err as AppError).statusCode, (err as AppError).message)
  }
}

export const getNestedReplies = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params
    const replies = await PostService.fetchRepliesRecursive(
      Number(postId),
      Number(req.query.depth) || 3,
    )
    success(res, 200, replies, 'Operation successful')
  } catch (err) {
    error(res, (err as AppError).statusCode, (err as AppError).message)
  }
}
