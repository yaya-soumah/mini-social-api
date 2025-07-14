import { Sequelize } from 'sequelize-typescript'
import { config } from 'dotenv'
import { models } from '../models/index.js'
config()

const isTest = process.env.NODE_ENV === 'test'
console.log('isTest is: ', isTest)
const sequelize = isTest
  ? new Sequelize({
      dialect: 'sqlite',
      storage: process.env.TEST_DB_STORAGE || ':memory:',
      logging: false,
      models,
    })
  : new Sequelize({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      models,
      logging: false,
    })

export default sequelize
