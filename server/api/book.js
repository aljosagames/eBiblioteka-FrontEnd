import express from "express"
import { getBooks, getBook, addBook, updateBook, createBook, deleteBook, removeBook } from "../controller/bookController.js"
import { authenticateToken } from "../middleware.js"

const router = express.Router()

// GET all books
router.post('/', authenticateToken, getBooks)
// GET one book
router.post('/getOne', getBook)
// CREATE book
router.post('/create', createBook)
// DELETE book
router.delete('/delete', deleteBook)
// REMOVE one book
router.patch('/remove', removeBook)
// ADD one book
router.patch('/add', addBook)
// UPDATE book
router.patch('/update', updateBook)

export default router