import express from 'express'
import mongoose from 'mongoose'
import userRoute from './api/user.js'
import bookRoute from './api/book.js'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import cors from "cors"
dotenv.config()
const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

// Middleware for parsing body
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// CORS
app.use(cors())

// Static files
app.use(express.static(path.join(__dirname, '..', 'public')))

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
