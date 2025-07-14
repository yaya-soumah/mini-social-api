import { Notification } from '../models/notification.model.js'
import { Request, Response, NextFunction } from 'express'
import { success } from '../utils/response.js'
import { AppError } from '../utils/app-error.js'

export const listNotifications = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user.id
  const notes = await Notification.findAll({
    where: { recipientId: userId },
    order: [['createdAt', 'DESC']],
  })
  success(res, 200, notes, 'Operation successful')
}

export const markRead = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const note = await Notification.findByPk(id)
  const userId = (req as any).user.id
  if (!note || note.recipientId !== userId) throw new AppError('notification not found', 404)
  note.isRead = true
  await note.save()
  success(res, 200, {}, 'Operation successful')
}
