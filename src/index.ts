import sequelize from './config/database.js'
import logger from './config/logger.js'
import { config } from 'dotenv'
import app from './app.js'

config()

const PORT = process.env.PORT || 8080

async function startServer() {
  try {
    await sequelize.authenticate()
    // await sequelize.sync({ force: false });
    logger.info('Database connected successfuly')
    app.listen(PORT, () => {
      logger.info(`Server listening on http://localhost:${PORT}/api/v1/`)
    })
  } catch (errror) {
    logger.error('Failed to start')
  }
}
startServer()
