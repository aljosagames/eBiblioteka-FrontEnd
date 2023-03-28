import express from "express"
import { loginUser, deleteUser, updateUser, isAdmin, registerUser, getUsers, getUser, addBookToUser, removeBookFromUser, verifyUser, makeAdmin, removeAdmin, changePasswordVerify, forgotPass } from "../controller/userController.js"
import { authenticateAdmin, authenticateToken } from "../middleware.js"

const router = express.Router()

// GET all users
router.post('/',  authenticateAdmin, getUsers)
// GET user
router.post('/getOne',  authenticateToken, getUser)
// AUTHENTICATE user
router.post('/login', loginUser)
// CREATE user
router.post('/register', registerUser)
// VERIFY user mail
router.post('/verify', verifyUser)
// TESTS if user is admin
router.post('/isAdmin', isAdmin)
// SENDS code for verification email
router.put('/forgotPass', forgotPass)
// DELETE user
router.delete('/delete', authenticateAdmin, deleteUser)
// MODIFY user
router.put('/changePassword', authenticateToken, updateUser)
// VERIFY user password
router.put('/changePasswordVerify', changePasswordVerify)
// ADD book to user
router.put('/addBook', authenticateAdmin, addBookToUser)
// ADD book to user
router.put('/removeBook', authenticateAdmin, removeBookFromUser)
// MAKE user admin
router.put('/makeAdmin', authenticateAdmin, makeAdmin)
// REMOVE user admin
router.put('/removeAdmin', authenticateAdmin, removeAdmin)

export default router