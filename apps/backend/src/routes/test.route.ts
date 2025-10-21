
import { Router } from 'express'
import isAuthenticated from '../middleware/auth.middleware'
import { TestController } from '../controllers/test.controller'
import { hasPermission, isRole } from '../middleware/role.middleware'

const router = Router()

router.use(isAuthenticated)

router.get('/', hasPermission(["test-permission", "perm-issi-on"]), TestController)

export default router