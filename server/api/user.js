import express from "express"
import { loginUser, deleteUser, updateUser, registerUser, getUsers, getUser, addBookToUser, removeBookFromUser, verifyUser, makeAdmin, removeAdmin } from "../controller/userController.js"
import { authenticateAdmin } from "../middleware.js"

const router = express.Router()

// GET all users
router.post('/',  authenticateAdmin, getUsers)
// GET user
router.post('/getOne',  authenticateAdmin, getUser)
// AUTHENTICATE user
router.post('/login', loginUser)
// CREATE user
router.post('/register', registerUser)
// VERIFY user mail
router.post('/verify', verifyUser)
// DELETE user
router.delete('/delete', authenticateAdmin, deleteUser)
// MODIFY user
router.patch('/update', authenticateAdmin, updateUser)
// ADD book to user
router.patch('/addBook', authenticateAdmin, addBookToUser)
// ADD book to user
router.patch('/removeBook', authenticateAdmin, removeBookFromUser)
// MAKE user admin
router.patch('/makeAdmin', authenticateAdmin, makeAdmin)
// REMOVE user admin
router.patch('/removeAdmin', authenticateAdmin, removeAdmin)

export default router