import { Router } from "express";
import { createCategory, editCategory } from "../controllers/category.controller";


const router = Router()

router.post("/", createCategory )
router.put("/:categoryId", editCategory )


export default router