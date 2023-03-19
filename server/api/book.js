import express from "express"
import { getBooks, getBook, addBook, updateBook, createBook, deleteBook, removeBook } from "../controller/bookController.js"
import { authenticateToken } from "../middleware.js"

const router = express.Router()

// GET all books
router.post('/', getBooks)
// GET one book
router.post('/getOne', getBook)
// CREATE book
router.post('/create', authenticateToken, createBook)
// DELETE book
router.delete('/delete', authenticateToken, deleteBook)
// REMOVE one book
router.patch('/remove', authenticateToken, removeBook)
// ADD one book
router.patch('/add', authenticateToken, addBook)
// UPDATE book
router.patch('/update', authenticateToken, updateBook)

export default router