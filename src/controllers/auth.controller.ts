import { Request, Response, NextFunction } from 'express'
import { registerUser, loginUser, refresh } from '../services/auth.service.js'
import { registerSchema, loginSchema } from '../validators/auth.schema.js'
import { success, error } from '../utils/response.js'
import { AppError } from '../utils/app-error.js'
import logger from '../config/logger.js'

export async function register(req: Request, res: Response) {
  try {
    const userRole = req.path === '/register/admin' ? 'admin' : 'user'
    const data = registerSchema.parse(req.body)
    const { user, accessToken, refreshToken } = await registerUser(data, userRole)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    success(res, 201, { token: accessToken, user }, 'Registration succesfull')
  } catch (err) {
    error(res, 400, `${err}`)
  }
}

export async function login(req: Request, res: Response) {
  try {
    const data = loginSchema.parse(req.body)

    const { user, accessToken, refreshToken } = await loginUser(data.email, data.password)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    success(res, 200, { token: accessToken, user }, 'login succesfull')
  } catch (err) {
    error(res, 400, `${err}`)
  }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.refreshToken
    if (!token) throw new AppError('Refresh token is required', 401)
    const { newToken } = await refresh(token)
    success(res, 200, { token: newToken })
  } catch (err) {
    next(err)
  }
}
