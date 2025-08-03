import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'

import swaggerRouter from './routes/swagger.routes'
import { notFoundHandler } from './middleware/errorNotFound.middleware'
import errorHandler from './middleware/errorMiddleware'
import routes from './routes/index'
import morganMiddleware from './middleware/morgan.middleware'

const app = express()

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: [
          "'self'",
          'http://127.0.0.1:8080',
          'http://localhost:8080',
          'https://mini-social-api.onrender.com',
        ],
        imgSrc: ["'self'", 'data:', 'blob:'],
        scriptSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  }),
)

app.use(
  cors({
    origin: [
      'http://localhost:8080',
      'https://editor.swagger.io',
      'https://mini-social-api.onrender.com',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type'],
    credentials: true, // Enable if using cookies/auth headers
  }),
)
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(morganMiddleware())

app.use('/api/v1', routes)
app.use('/docs', swaggerRouter)

//Not found handler
app.use(notFoundHandler)
// Error handling
app.use(errorHandler)

export default app
