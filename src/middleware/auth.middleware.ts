import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt.js'
import { AppError } from '../utils/app-error.js'

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  const token = authHeader?.split(' ')[1]

  if (!token) {
    throw new AppError('Access denied. No token provided.', 401)
  }

  try {
    const decoded = verifyAccessToken(token)
    ;(req as any).user = decoded
    next()
  } catch (err) {
    throw new AppError('Invalid or expired token.', 403)
  }
}
