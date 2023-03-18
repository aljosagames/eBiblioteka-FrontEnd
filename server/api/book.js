import express from "express"
import { getBooks, createBook, deleteBook } from "../controller/bookController.js"
import { authenticateToken } from "../middleware.js"

const router = express.Router()

// GET post
router.post('/', getBooks)
// POST post
router.post('/create', createBook)
// DELETE post
router.delete('/', deleteBook)

export default router