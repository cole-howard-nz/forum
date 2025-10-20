
import { Router } from 'express'
import isAuthenticated from '../middleware/auth.middleware'
import { TestController } from '../controllers/test.controller'
import { isRole } from '../middleware/role.middleware'

const router = Router()

router.use(isAuthenticated)

router.get('/', isRole(1), TestController)

export default router