import { Router } from 'express'

import { authenticateToken } from '../middleware/auth.middleware.js'
import { togglePostLike, getPostLikes } from '../controllers/like.controller.js'

const router = Router()

router.use(authenticateToken)
router.post('/posts/:postId/like', togglePostLike)
router.get('/posts/:postId/likes', getPostLikes)

export default router
