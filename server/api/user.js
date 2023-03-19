import express from "express"
import { loginUser, deleteUser, updateUser, registerUser, getUsers, getUser, addBookToUser, removeBookFromUser, verifyUser } from "../controller/userController.js"
import { authenticateToken } from "../middleware.js"

const router = express.Router()

// GET all users
router.post('/',  authenticateToken, getUsers)
// GET user
router.post('/getOne',  authenticateToken, getUser)
// AUTHENTICATE user
router.post('/login', loginUser)
// CREATE user
router.post('/register', registerUser)
// VERIFY user mail
router.post('/verify', verifyUser)
// DELETE user
router.delete('/delete', authenticateToken, deleteUser)
// MODIFY user
router.patch('/update', updateUser)
// ADD book to user
router.patch('/addBook', authenticateToken, addBookToUser)
// ADD book to user
router.patch('/removeBook', authenticateToken, removeBookFromUser)

export default router