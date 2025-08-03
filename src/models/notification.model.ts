import { InferAttributes, InferCreationAttributes } from 'sequelize'
import {
  Table,
  Model,
  Column,
  ForeignKey,
  DataType,
  BelongsTo,
  Default,
} from 'sequelize-typescript'

import { User } from './user.model.js'

@Table({ tableName: 'mini_social_notifications', timestamps: true })
export class Notification extends Model<
  InferAttributes<Notification>,
  InferCreationAttributes<Notification>
> {
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  recipientId!: number

  @Column(DataType.STRING)
  type!: string

  @Column(DataType.STRING)
  message!: string

  @Default(false)
  @Column(DataType.BOOLEAN)
  isRead?: boolean

  @Column(DataType.JSONB)
  metadata?: any

  @BelongsTo(() => User)
  recipient?: User
}
