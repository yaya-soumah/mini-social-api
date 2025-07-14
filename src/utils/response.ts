import { Request, Response } from 'express'

export const success = (
  res: Response,
  statusCode: number,
  data: any,
  message: string = 'Operation successfull',
  meta: any = {}
) => {
  res.status(statusCode).json({
    status: 'success',
    message,
    data,
    meta,
    error: null,
  })
}

export const error = (res: Response, statusCode: number, message: string, meta: any = {}) => {
  res.status(statusCode).json({
    status: 'error',
    message,
    data: null,
    meta: {},
  })
}
