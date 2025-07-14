import { Request, Response, NextFunction } from 'express'
import { likeService } from '../services/like.service.js'

export const togglePostLike = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user.id
  const postId = Number(req.params.postId)

  const result = await likeService.toggleLike(userId, postId)
  res.status(200).json(result)
}

export const getPostLikes = async (req: Request, res: Response, next: NextFunction) => {
  const postId = Number(req.params.postId)
  const likes = await likeService.getPostLikers(postId)
  res.json({ count: likes.length, users: likes.map((l) => l.user) })
}
