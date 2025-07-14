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
import { ownerOrAdmin } from '../middleware/postOwner.middleware.js'
import { authenticateToken } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.js'

const router = Router()
router.get('/timeline', getPaginatedGlobalPosts) //no authentication
router.use(authenticateToken)

router.get('/', listPostsByUser)
router.get('/:id', getPost)
router.post('/', validate(createPostSchema), createPost)
router.patch('/:id', validate(updatePostSchema), ownerOrAdmin, updatePost)
router.delete('/:id', ownerOrAdmin, deletePost)
router.post('/:parentId/replies', authenticateToken, replyToPost)
router.get('/:parentId/replies', authenticateToken, getReplies)
router.get('/:postId/replies', getNestedReplies)

export default router
