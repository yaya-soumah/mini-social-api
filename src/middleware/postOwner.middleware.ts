import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/app-error'
import { PostRepository } from '../repositories/post.repository.js'

export const ownerOrAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { id, role } = (req as any).user
  const postId = parseInt(req.params.id)
  const post = await PostRepository.getPostById(postId)
  if (!post) throw new AppError('post not found', 404)
  if (post?.authorId !== id && role !== 'admin')
    throw new AppError('Forbidden: Insufficient permissions', 403)
  next()
}
