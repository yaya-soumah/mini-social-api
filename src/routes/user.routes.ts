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
import { authorizeRole } from '../middleware/requireRole.js'
import { authenticateToken } from '../middleware/auth.middleware.js'
import { upload } from '../middleware/upload.js'
import {
  updateProfileSchema,
  updateUserPasswordSchema,
  RoleSchema,
} from '../validators/user.schema.js'

const router = Router()

router.get('/profile/public/:username', getPublicProfile)

router.use(authenticateToken)

router.get('/all', authorizeRole('admin'), getUserList)
router.get('/me', getUser)
router.get('/search', searchUsers)
router.delete('/:id', authorizeRole('admin'), remove)
router.patch('/me/avatar', upload.single('avatar'), uploadAvatar)
router.patch('/me/password', validate(updateUserPasswordSchema), updateUserPassword)
router.patch('/me', validate(updateProfileSchema), updateProfile)
router.patch('/:id/role', authorizeRole('admin'), validate(RoleSchema), updateUserRole)

export default router
