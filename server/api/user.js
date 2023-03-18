import express from "express"
import { loginUser, registerUser } from "../controller/userController.js"

const router = express.Router()

// AUTHENTICATE user
router.post('/login', loginUser)
// CREATE user
router.post('/register', registerUser)

export default router