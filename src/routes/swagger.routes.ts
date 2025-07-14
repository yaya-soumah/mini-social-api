import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import path from 'path'

const router = Router()

const swaggerPath = path.join(process.cwd(), 'src/docs/swagger.yaml')
const swaggerDocument = YAML.load(swaggerPath)

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

export default router
