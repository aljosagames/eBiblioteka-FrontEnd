import express from "express"
import { getPosts, getPost, createPost, deletePost } from "../controller/postController.js"
import { authenticateToken } from "../middleware.js"

const router = express.Router()

// GET post
router.get('/id/', getPost)
// GET posts
router.get('/', authenticateToken, getPosts)
// POST post
router.post('/', createPost)
// DELETE post
router.delete('/', deletePost)

export default router