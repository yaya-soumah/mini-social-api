import { PostService } from '../services/post.service.js'
import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/app-error.js'
import { success } from '../utils/response.js'
import { connection } from '../queues/notificationQueue.js'

export const getPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id)
    const post = await PostService.getPost(id)
    success(res, 200, post, 'Operation successful')
  } catch (err) {
    next(err)
  }
}

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorId = (req as any).user.id
    const data = { authorId, ...req.body }
    const post = await PostService.createPost(data)
    if (!post) throw new AppError('Post not created', 400)
    success(res, 201, post, 'post created successfully')
  } catch (err) {
    next(err)
  }
}

export const listPostsByUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id
    const posts = await PostService.getPostsByUser(userId, req.query)
    success(res, 200, posts, 'Operation successful')
  } catch (err) {
    next(err)
  }
}

export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id)
    const post = await PostService.updatePost(id, req.body)
    success(res, 200, post, 'post updated')
  } catch (err) {
    next(err)
  }
}

export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id)
    await PostService.deletePost(id)
    success(res, 204, {}, 'Post deleted successfully')
  } catch (err) {
    next(err)
  }
}

export const replyToPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = (req as any).user.id
    const { parentId } = req.params
    const { content } = req.body
    console.log('author id ', id)
    const reply = await PostService.createReply(id, content, Number(parentId))
    success(res, 201, reply, 'Operation successful')
  } catch (err) {
    next(err)
  }
}

export const getReplies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parentId = parseInt(req.params.parentId)
    const replies = await PostService.getAllReplies(parentId, req.query)
    success(res, 200, replies, 'Operation successful')
  } catch (err) {
    next(err)
  }
}

export const getNestedReplies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params
    const replies = await PostService.fetchRepliesRecursive(
      Number(postId),
      Number(req.query.depth) || 3
    )
    success(res, 200, replies, 'Operation successful')
  } catch (err) {
    next(err)
  }
}

export const getPaginatedGlobalPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const authorId = req.query.authorId ? Number(req.query.authorId) : undefined
    const keyword = req.query.keyword as string | undefined
    const cacheKey = `timeline: page:${page}:limit:${limit}:authorId:${authorId}:keyword:${keyword}`
    const cached = await connection.get(cacheKey)

    if (cached) {
      success(res, 200, cached, 'Operation successfull')
    }

    const filters = { authorId, keyword }
    const result = await PostService.findAllPosts(page, limit, filters)

    await connection.set(cacheKey, JSON.stringify(result), 'EX', 60)

    success(res, 200, result, 'Operation successfull')
  } catch (err) {
    next(err)
  }
}
