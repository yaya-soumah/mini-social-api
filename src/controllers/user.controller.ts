import { Request, Response, NextFunction } from 'express'
import { success } from '../utils/response.js'
import { UserService } from '../services/user.service.js'
import { AppError } from '../utils/app-error.js'

export const getUserList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserService.findAllUsers(req.query)
    success(res, 200, result, 'Operation successfull')
  } catch (err) {
    next(err)
  }
}

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id)
    const user = await UserService.findUserById(id)
    success(res, 200, user)
  } catch (err) {
    next(err)
  }
}

export const changeRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id)
    const { role } = req.body
    const data = await UserService.promoteUser(id, role)
    success(res, 200, data, 'user updated successfully.')
  } catch (err) {
    next(err)
  }
}
export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id)
    await UserService.removeUser(id)
    success(res, 204, 'user removed successfully.')
  } catch (err) {
    next(err)
  }
}

export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = req.body
    const { id } = req.params

    const user = await UserService.findUserById(parseInt(id))
    if (!user) throw new AppError('User not found', 404)

    user.role = role
    await user.save()
    success(res, 200, user, 'Role updated successfully')
  } catch (err) {
    next(err)
  }
}

export const getPublicProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.params.username
    const profile = await UserService.getPublicProfile(username)
    success(res, 200, profile, 'Operation successful')
  } catch (err) {
    next(err)
  }
}

export const searchUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query.q as string
    const results = await UserService.searchUsers(query)
    success(res, 200, results, 'Operation successful')
  } catch (err) {
    next(err)
  }
}

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updates = req.body
    const userId = (req as any).user.id
    const result = await UserService.updateUserProfile(userId, updates)
    success(res, 200, result, 'Profile updated successfully')
  } catch (err) {
    next(err)
  }
}

export const uploadAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id
    const file = req.file

    if (!file) {
      throw new AppError('No file uploaded', 400)
    }

    const avatarUrl = `/uploads/${file.filename}`
    const updatedUser = await UserService.updateUserProfile(userId, { avatar: avatarUrl })
    success(res, 200, updatedUser, 'Avatar updated successfully')
  } catch (err) {
    next(err)
  }
}

export const updateUserPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body
    const id = (req as any).user.id
    const user = await UserService.updateUserPassword(id, currentPassword, newPassword)
    success(res, 200, user, 'Password updated successfully')
  } catch (err) {
    next(err)
  }
}
