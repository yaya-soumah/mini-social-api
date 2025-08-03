import { Router } from 'express'

import { authenticateToken } from '../middleware/auth.middleware.js'
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} from '../controllers/follow.controller.js'

const router = Router()
router.use(authenticateToken)
router.post('/:id', followUser) // Follow a user
router.delete('/:id', unfollowUser) // Unfollow a user
router.get('/:id/followers', getFollowers) // Get followers
router.get('/:id/following', getFollowing) // Get following

export default router
