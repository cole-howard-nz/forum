import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.middleware";
import { createGroup, deleteGroup, editGroup, getAllGroups, getGroupById } from "../controllers/group.controller";


const router = Router()

router.use(isAuthenticated)

router.get("/", getAllGroups)
router.get("/:groupId", getGroupById)

router.post("/", createGroup)

router.put("/:groupId", editGroup)
router.delete("/:groupId", deleteGroup)


export default router