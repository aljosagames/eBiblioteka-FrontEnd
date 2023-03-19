import express from "express"
import { loginUser, deleteUser, updateUser, registerUser, getUsers, addBookToUser, removeBookFromUser } from "../controller/userController.js"

const router = express.Router()

// GET all users
router.get('/', getUsers)
// AUTHENTICATE user
router.post('/login', loginUser)
// CREATE user
router.post('/register', registerUser)
// DELETE user
router.delete('/delete', deleteUser)
// MODIFY user
router.patch('/update', updateUser)
// ADD book to user
router.patch('/addBook', addBookToUser)
// ADD book to user
router.patch('/removeBook', removeBookFromUser)

export default router