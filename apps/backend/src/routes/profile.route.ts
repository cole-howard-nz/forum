import { Router } from "express"
import { createProfile, deleteProfile, editProfile, getProfile } from "../controllers/profile.controller"
import { isAuthenticated } from "../middleware/auth.middleware"

const router = Router()

router.use(isAuthenticated)

router.get("/:userId", getProfile)
router.get("/", getProfile)

router.post("/:userId", createProfile)
router.put("/:userId", editProfile)

router.delete("/:userId", deleteProfile)

export default router