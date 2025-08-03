import {
  Model,
  Table,
  Column,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Unique,
  AllowNull,
  Default,
  BelongsToMany,
} from 'sequelize-typescript'
import { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize'

import { Follow } from './follow.model.js'

@Table({
  tableName: 'mini_social_users',
  timestamps: true,
  defaultScope: {
    attributes: { exclude: ['password'] },
  },
})
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: CreationOptional<number>

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  email!: string

  @AllowNull(false)
  @Column(DataType.STRING)
  password!: string

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  username!: string

  @AllowNull(true)
  @Column(DataType.STRING)
  bio?: string

  @AllowNull(true)
  @Column(DataType.STRING)
  avatar?: string

  @Default('user')
  @Column(DataType.STRING)
  role!: 'user' | 'admin'

  @BelongsToMany(() => User, () => Follow, 'followerId', 'followingId')
  following!: User[]

  @BelongsToMany(() => User, () => Follow, 'followingId', 'followerId')
  followers!: User[]
}
