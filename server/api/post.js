import express from "express"
import { getPosts, getPost, createPost, deletePost } from "../controller/postController.js"
const router = express.Router()

// GET post
router.get('/id/', getPost)
// GET posts
router.get('/', getPosts)
// POST post
router.post('/', createPost)
// DELETE post
router.delete('/', deletePost)

export default router