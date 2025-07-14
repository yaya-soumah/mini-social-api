import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/app-error.js'

export function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user

    if (!user || user.role !== role) {
      throw new AppError('Forbidden: Insufficient permissions', 403)
    }
    next()
  }
}
