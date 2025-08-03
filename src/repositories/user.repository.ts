import { Op } from 'sequelize'

import { User } from '../models'

export class UserRepository {
  static async findAll(limit: number, offset: number) {
    const { count, rows } = await User.findAndCountAll({
      limit,
      offset,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
    })
    return { users: rows, total: count }
  }

  static async findOneById(id: number) {
    return (
      (await User.findByPk(id, {
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
      })) || null
    )
  }
  static async findOneByIdForPasswordChange(id: number) {
    return (await User.scope().findByPk(id)) || null
  }

  static async findOneByUsername(username: string) {
    return (
      (await User.findOne({
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
      })) || null
    )
  }

  static async findOneByEmail(email: string) {
    return (await User.scope().findOne({ where: { email } })) || null
  }

  static async createOne(data: any) {
    return User.create(data)
  }

  static async updateRole(id: number, role: 'user' | 'admin') {
    const user = await this.findOneById(id)
    if (!user) return null
    return user.update({ role })
  }

  static async deleteOne(id: number) {
    const user = await this.findOneById(id)
    if (!user) return false
    await user.destroy()
    return true
  }

  static async search(query: string) {
    return User.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.like]: `%${query.toLocaleLowerCase()}%` } },
          { bio: { [Op.like]: `%${query}%` } },
        ],
      },
      attributes: ['id', 'username', 'bio'],
    })
  }

  static async updateOne(userId: number, updates: Partial<User>) {
    const user = await this.findOneById(userId)
    if (!user) return null
    return await user.update(updates)
  }
}
