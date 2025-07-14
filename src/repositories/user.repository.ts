import { Op } from 'sequelize'
import { User } from '../models/user.model.js'
import { UserType } from '../types/user.types.js'
import { AppError } from '../utils/app-error.js'

export class UserRepository {
  static async findAllUsers(limit: number, offset: number) {
    const { count, rows } = await User.findAndCountAll({
      limit,
      offset,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
    })
    return { users: rows, total: count }
  }

  static async findUserById(id: number) {
    return User.findByPk(id, {
      include: [
        {
          association: User.associations.followers,
          attributes: ['id', 'username'],
        },
        {
          association: User.associations.following,
          attributes: ['id', 'username'],
        },
      ],
    })
  }
  static async findUserByIdForPasswordChange(id: number) {
    return User.scope().findByPk(id)
  }

  static async findUserByUsername(username: string) {
    return User.findOne({
      where: { username },
      attributes: ['id', 'username', 'bio', 'avatar', 'role', 'createdAt'],
      include: [
        {
          association: User.associations.followers,
          attributes: ['id', 'username'],
        },
        {
          association: User.associations.following,
          attributes: ['id', 'username'],
        },
      ],
    })
  }

  static async findUserByEmail(email: string) {
    return User.scope().findOne({ where: { email } })
  }

  static async createUser(data: any) {
    return User.create(data)
  }

  static async updateUserRole(id: number, role: 'user' | 'admin') {
    const user = await this.findUserById(id)
    if (!user) return null
    user.role = role
    await user.save()
    return user
  }

  static async deleteUserById(id: number) {
    return User.destroy({ where: { id } })
  }

  static async searchUsers(query: string) {
    return User.findAll({
      where: {
        username: { [Op.iLike]: `%${query}%` },
      },
      attributes: ['id', 'username', 'bio'],
    })
  }

  static async updateUserProfile(userId: number, updates: Partial<User>) {
    const user = await this.findUserById(userId)
    if (!user) return null
    return await user.update(updates)
  }
}
