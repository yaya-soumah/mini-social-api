import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
  BelongsTo,
  Default,
} from 'sequelize-typescript'

import { User } from './user.model.js'
import { Post } from './post.model.js'

@Table({ tableName: 'mini_social_likes', timestamps: true })
export class Like extends Model {
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId!: number

  @ForeignKey(() => Post)
  @Column(DataType.INTEGER)
  postId!: number

  @Default(true)
  @Column(DataType.BOOLEAN)
  active!: boolean

  @BelongsTo(() => User)
  user!: User

  @BelongsTo(() => Post)
  post!: Post
}
