import fs from 'fs'
import path from 'path'

import bcrypt from 'bcrypt'

import { UserRepository } from '../repositories/user.repository.js'
import { AppError } from '../utils/app-error.js'
import logger from '../config/logger.js'
import { getPagination } from '../utils/pagination.js'

export class UserService {
  static async updatePassword(id: number, currentPassword: string, newPassword: string) {
    const user = await UserRepository.findOneByIdForPasswordChange(id)
    if (!user) throw new AppError('User not found', 404)

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) throw new AppError('Invalid password', 400)

    user.password = await bcrypt.hash(newPassword, 10)
    const updatedUser = await user.save()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...profile } = updatedUser.get({ plain: true })
    return profile
  }

  static async findAllUsers(query: any) {
    const { page, limit, offset } = await getPagination(query)
    const { users, total } = await UserRepository.findAll(limit, offset)
    return { total, page, users }
  }

  static async findUserById(id: number) {
    const user = await UserRepository.findOneById(id)
    if (!user) throw new AppError('User not found', 404)
    return user
  }

  static async promoteUser(id: number, role: 'user' | 'admin') {
    const updated = await UserRepository.updateRole(id, role)
    if (!updated) throw new AppError('User not found', 404)
    return updated
  }
  static async removeUser(id: number) {
    await UserRepository.deleteOne(id)
  }

  static async getPublicProfile(username: string) {
    const user = await UserRepository.findOneByUsername(username)
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
    return await UserRepository.search(query)
  }

  static async updateUserProfile(userId: number, updates: Partial<any>) {
    console.log('updateUserProfile in ctrl called', updates.role)
    const user = await UserRepository.findOneById(userId)
    if (!user) throw new AppError('User not found', 404)

    if (user.avatar) {
      const oldPath = path.join(__dirname, '../..', user.avatar)

      fs.access(oldPath, fs.constants.F_OK, (err) => {
        logger.error(`err reading fils: ${err}`)
        if (!err) {
          fs.unlink(oldPath, (unlinkErr) => {
            if (unlinkErr) logger.error(`Error deleting old avatar: ${unlinkErr}`)
          })
        }
      })
    }

    const updated = await UserRepository.updateOne(userId, updates)
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
