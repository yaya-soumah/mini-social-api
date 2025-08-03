import { Router } from 'express'

import authRouter from './auth.route'
import followRouter from './follow.routes'
import likeRouters from './like.routers'
import notificationRoutes from './notification.routes'
import postRoutes from './post.routes'
import userRoutes from './user.routes'

const router = Router()

router.use('/follows', followRouter)
router.use('/auth', authRouter)
router.use('/users', userRoutes)
router.use('/likes', likeRouters)
router.use('/notifications', notificationRoutes)
router.use('/posts', postRoutes)

export default router
