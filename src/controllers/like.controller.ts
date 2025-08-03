import { Request, Response } from 'express'

import { likeService } from '../services/like.service.js'
import { error, success } from '../utils/response.js'
import { AppError } from '../utils/app-error.js'

export const togglePostLike = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    const postId = Number(req.params.postId)

    const result = await likeService.toggleLike(userId, postId)
    success(res, 200, result, 'Operation successful')
  } catch (err) {
    error(res, (err as AppError).statusCode, (err as AppError).message)
  }
}

export const getPostLikes = async (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.postId)
    const likes = await likeService.getPostLikers(postId)
    success(
      res,
      200,
      { count: likes.length, users: likes.map((l) => l.user) },
      'Operation successful',
    )
  } catch (err) {
    error(res, (err as AppError).statusCode, (err as AppError).message)
  }
}
