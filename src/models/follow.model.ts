import { Table, Model, Column, DataType, ForeignKey } from 'sequelize-typescript'
import { InferAttributes, InferCreationAttributes } from 'sequelize'

import { User } from './user.model.js'

@Table({ tableName: 'mini_social_follows', timestamps: true })
export class Follow extends Model<InferAttributes<Follow>, InferCreationAttributes<Follow>> {
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  followerId!: number

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  followingId!: number
}
