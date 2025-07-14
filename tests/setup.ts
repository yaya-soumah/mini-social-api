import { beforeAll, afterAll } from 'vitest'
import sequelize from '../src/config/database'

beforeAll(async () => {
  await sequelize.sync({ force: true }) // reset DB before test suite
})

afterAll(async () => {
  await sequelize.close()
})
