import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.middleware";
import { getAllPosts, getHiddenPosts, getLockedPosts, getMostViewedPosts, getPinnedPosts, getPostsByAlphabet, getPostsByUser } from "../controllers/post.controller";


const router = Router()

router.use(isAuthenticated)

router.get("/", getAllPosts )
router.get("/alpha", getPostsByAlphabet )
router.get("/hidden", getHiddenPosts)
router.get("/pinned", getPinnedPosts)
router.get("/locked", getLockedPosts)
router.get("/most-views", getMostViewedPosts)
router.get("/:userId", getPostsByUser )

export default router