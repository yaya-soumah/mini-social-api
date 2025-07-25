import {
  Table,
  Column,
  Unique,
  ForeignKey,
  DataType,
  Default,
  Model,
  PrimaryKey,
  AutoIncrement,
  BelongsTo,
  AllowNull,
  Length,
  HasMany,
} from 'sequelize-typescript'
import { InferAttributes, InferCreationAttributes, Optional } from 'sequelize'
import { User } from './user.model'

@Table({ tableName: 'posts', timestamps: true })
export class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
  @AllowNull(false)
  @Length({ max: 280 })
  @Column(DataType.STRING)
  content!: string

  @AllowNull
  @Column(DataType.STRING)
  mediaUrl?: string

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  authorId!: number

  @BelongsTo(() => User)
  users?: User

  @ForeignKey(() => Post)
  @AllowNull
  @Column(DataType.INTEGER)
  parentId?: number

  @BelongsTo(() => Post, 'parentId')
  parentPost?: Post

  @HasMany(() => Post, 'parentId')
  replies?: Post[]
}
