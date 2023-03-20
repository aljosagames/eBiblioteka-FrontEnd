import express from 'express'
import mongoose from 'mongoose'
import userRoute from './api/user.js'
import bookRoute from './api/book.js'
import dotenv from 'dotenv'
import cors from "cors"
import { isExpired } from './middleware.js'
dotenv.config()
const app = express()

// Middleware for parsing body
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Checking if book is expired

// CORS
app.use(cors())

// Route for user API
app.use('/api/user', userRoute)
// Route for posts API
app.use('/api/book', bookRoute)

// Mongodb warning
mongoose.set('strictQuery', true)

// Connecting to the database
const PORT = process.env.PORT || 8080
const CONNECTION_URL = process.env.CONNECTION_URL
mongoose.connect(CONNECTION_URL)
    .then(() => app.listen(PORT, () => console.log(`Server is running on localhost:${PORT}`)))
    .catch((error) => console.log(error.message))

// Checking if book is expired
// setInterval(isExpired,1000)