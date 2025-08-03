import { Request, Response } from 'express'

import { Notification } from '../models/notification.model.js'
import { error, success } from '../utils/response.js'
import { AppError } from '../utils/app-error.js'

export const listNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    const notes = await Notification.findAll({
      where: { recipientId: userId },
      order: [['createdAt', 'DESC']],
    })
    success(res, 200, notes, 'Operation successful')
  } catch (err) {
    error(res, (err as AppError).statusCode, (err as AppError).message)
  }
}

export const markRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const note = await Notification.findByPk(id)
    const userId = (req as any).user.id
    if (!note || note.recipientId !== userId) throw new AppError('notification not found', 404)
    note.isRead = true
    await note.save()
    success(res, 200, {}, 'Operation successful')
  } catch (err) {
    error(res, (err as AppError).statusCode, (err as AppError).message)
  }
}
