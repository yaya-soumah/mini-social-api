import { Router } from 'express'
import { validate } from '../middleware/validate.js'
import {
  getUserList,
  getUser,
  updateUserRole,
  remove,
  getPublicProfile,
  searchUsers,
  updateProfile,
  uploadAvatar,
  updateUserPassword,
} from '../controllers/user.controller.js'
import { requireRole } from '../middleware/requireRole.js'
import { authenticateToken } from '../middleware/auth.middleware.js'
import { upload } from '../middleware/upload.js'
import { updateProfileSchema, updateUserPasswordSchema } from '../validators/user.schema.js'

const router = Router()

router.get('/profile/:username', getPublicProfile)
router.use(authenticateToken)

router.get('/', requireRole('admin'), getUserList)
router.get('/:id', getUser)
router.delete('/:id', requireRole('admin'), remove)
router.patch('/:id/role', requireRole('admin'), updateUserRole)
router.get('/search', searchUsers)
router.patch('/me', validate(updateProfileSchema), updateProfile)
router.patch('/me/avatar', upload.single('avatar'), uploadAvatar)
router.patch('/me/password', validate(updateUserPasswordSchema), updateUserPassword)

export default router
