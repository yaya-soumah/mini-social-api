import express from 'express'
import cookieParser from 'cookie-parser'
import logger from './config/logger.js'
import errorHandler from './middleware/errorMiddleware.js'
// routes
import authRouter from './routes/auth.route.js'
import userRouter from './routes/user.routes.js'
import followRouter from './routes/follow.routes.js'
import postRouter from './routes/post.routes.js'
import likeRouter from './routes/like.routers.js'
import notificationRouter from './routes/notification.routes.js'
import swaggerRouter from './routes/swagger.routes.js'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static('uploads'))

//endpoints
const base_url = '/api/v1'
app.get(base_url, (_, res) => {
  res.send('Micro Blog is up!')
})

app.use(base_url + '/auth', authRouter)
app.use(base_url + '/users', userRouter) // admin-only
app.use(base_url + '/follows', followRouter)
app.use(base_url + '/posts', postRouter)
app.use(base_url + '/likes', likeRouter)
app.use(base_url + '/notifications', notificationRouter)
app.use(base_url + '/docs', swaggerRouter)

// Error handling
app.use(errorHandler)

export default app
