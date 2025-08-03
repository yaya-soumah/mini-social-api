import { Router } from 'express'

import { listNotifications, markRead } from '../controllers/notification.controller.js'
import { authenticateToken } from '../middleware/auth.middleware.js'
const router = Router()

router.use(authenticateToken)
router.get('/', listNotifications)
router.patch('/:id/read', markRead)

export default router
