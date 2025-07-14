import fs from 'fs'
import bcrypt from 'bcrypt'
import { User } from '../models/user.model.js'
import { UserRepository } from '../repositories/user.repository.js'
import { AppError } from '../utils/app-error.js'
import path from 'path'
import logger from '../config/logger.js'
import { Request } from 'express'
import { getPagination } from '../utils/pagination.js'

export class UserService {
  static async updateUserPassword(id: number, currentPassword: string, newPassword: string) {
    const user = await UserRepository.findUserByIdForPasswordChange(id)
    console.log('user in service: ', user)
    if (!user) throw new AppError('User not found', 404)
    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) throw new AppError('Wrong password', 400)
    const hashed = await bcrypt.hash(newPassword, 10)
    user.password = hashed
    const updatedUser = await user.save()
    const { password, ...profile } = updatedUser.dataValues
    return profile
  }

  static async findAllUsers(query: any) {
    const { page, limit, offset } = await getPagination(query)
    const { users, total } = await UserRepository.findAllUsers(limit, offset)
    return { total, page, users }
  }

  static async findUserById(id: number) {
    const user = await UserRepository.findUserById(id)
    if (!user) throw new AppError('User not found', 404)
    return user
  }

  static async promoteUser(id: number, role: 'user' | 'admin') {
    const updated = await UserRepository.updateUserRole(id, role)
    if (!updated) throw new AppError('User not found', 404)
    return updated
  }
  static async removeUser(id: number) {
    await UserRepository.deleteUserById(id)
  }

  static async getPublicProfile(username: string) {
    const user = await UserRepository.findUserByUsername(username)
    if (!user) throw new AppError('User not found', 404)

    return {
      id: user.id,
      username: user.username,
      bio: user.bio,
      avatar: user.avatar,
      role: user.role,
      CreatedAt: user.createdAt,
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
    }
  }

  static async searchUsers(query: string) {
    if (!query) throw new AppError('Missing search query', 400)
    return await UserRepository.searchUsers(query)
  }

  static async updateUserProfile(userId: number, updates: Partial<any>) {
    const user = await UserRepository.findUserById(userId)
    if (!user) throw new AppError('User not found', 404)

    if (user.avatar) {
      const oldPath = path.join(__dirname, '../..', user.avatar)
      logger.info(`path from req: ${oldPath}`)
      fs.access(oldPath, fs.constants.F_OK, (err) => {
        logger.error(`err reading fils: ${err}`)
        if (!err) {
          fs.unlink(oldPath, (unlinkErr) => {
            if (unlinkErr) logger.error(`Error deleting old avatar: ${unlinkErr}`)
          })
        }
      })
    }

    const updated = await UserRepository.updateUserProfile(userId, updates)
    if (!updated) throw new AppError('User not found', 404)

    return {
      id: updated.id,
      username: updated.username,
      bio: updated.bio,
      avatar: updated.avatar,
      role: updated.role,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    }
  }
}
