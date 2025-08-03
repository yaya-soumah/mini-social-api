import { Request, Response } from 'express'

import { FollowService } from '../services/follow.service.js'
import { error, success } from '../utils/response.js'
import { AppError } from '../utils/app-error.js'

export const followUser = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user
    const followerId = user.id
    const followingId = parseInt(req.params.id)
    await FollowService.follow({ followerId, followingId })

    success(res, 200, {}, 'Followed successfully')
  } catch (err) {
    error(res, (err as AppError).statusCode, (err as AppError).message)
  }
}

export const unfollowUser = async (req: Request, res: Response) => {
  try {
    const followerId = (req as any).user.id
    const followingId = parseInt(req.params.id)
    await FollowService.unfollow(followerId, followingId)

    success(res, 200, {}, 'Unfollowed successfully')
  } catch (err) {
    error(res, (err as AppError).statusCode, (err as AppError).message)
  }
}

export const getFollowers = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id)
    const { followers, total, page } = await FollowService.getFollowers(userId, req.query)

    success(res, 200, { followers, total, page }, 'operation successfully')
  } catch (err) {
    error(res, (err as AppError).statusCode, (err as AppError).message)
  }
}

export const getFollowing = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id)
    const { following, total, page } = await FollowService.getFollowing(userId, req.query)

    success(res, 200, { following, total, page }, 'operation successfully')
  } catch (err) {
    error(res, (err as AppError).statusCode, (err as AppError).message)
  }
}
