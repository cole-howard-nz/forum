import { Router } from "express"
import { createProfile, getAllProfiles } from "../controllers/profile.controller"
import { isAuthenticated } from "../middleware/auth.middleware"

const router = Router()

router.use(isAuthenticated)

router.get("/all", getAllProfiles)
router.post("/", createProfile)

export default router