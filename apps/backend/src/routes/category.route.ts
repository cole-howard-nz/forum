import { Router } from "express";
import { createCategory, deleteCategory, editCategory, getAllCategories, getCategoryByGroupId, getCategoryById } from "../controllers/category.controller";
import { isAuthenticated } from "../middleware/auth.middleware";


const router = Router()

router.use(isAuthenticated)

router.get("/", getAllCategories )
router.get("/:categoryId", getCategoryById )
router.get("/:groupId", getCategoryByGroupId )

router.post("/", createCategory )

router.put("/:categoryId", editCategory )
router.delete("/:categoryId", deleteCategory )


export default router