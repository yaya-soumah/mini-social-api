import { Request, Response, NextFunction } from 'express'
import { error } from '../utils/response.js'
import { AppError } from '../utils/app-error.js'
import logger from '../config/logger.js'

const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  console.log('error stack in errorMiddleware: ', err.stack)
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'
  error(res, statusCode, message)
}

export default errorHandler
