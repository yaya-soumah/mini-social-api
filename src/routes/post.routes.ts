import { Router } from 'express'

import {
  listPostsByUser,
  createPost,
  updatePost,
  deletePost,
  getPost,
  replyToPost,
  getReplies,
  getNestedReplies,
  getPaginatedGlobalPosts,
} from '../controllers/post.controller.js'
import { createPostSchema, updatePostSchema } from '../validators/post.schema.js'
import { authenticateToken } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.js'
import { authorizeRole } from '../middleware/requireRole.js'

const router = Router()
router.get('/timeline', getPaginatedGlobalPosts) //no authentication
router.use(authenticateToken)

router.get('/:id', getPost)
router.get('/', listPostsByUser)
router.post('/', validate(createPostSchema), createPost)
router.patch('/:id', validate(updatePostSchema), authorizeRole('user', 'admin'), updatePost)
router.delete('/:id', authorizeRole('user', 'admin'), deletePost)
router.post('/:parentId/replies', authenticateToken, replyToPost)
router.get('/:parentId/replies', authenticateToken, getReplies)
router.get('/:postId/replies', getNestedReplies)

export default router
