import express from 'express'
import mongoose from 'mongoose'
import userRoute from './api/user.js'
import postRoute from './api/post.js'
import dotenv from 'dotenv'
import cors from "cors"
dotenv.config()
const app = express()

// Middleware for parsing body
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// CORS
app.use(cors())

// Route for user API
app.use('/api/user', userRoute)
// Route for posts API
app.use('/api/post', postRoute)

// Mongodb warning
mongoose.set('strictQuery', true)

// Connecting to the database
const PORT = process.env.PORT || 8080
const CONNECTION_URL = process.env.CONNECTION_URL
mongoose.connect(CONNECTION_URL)
    .then(() => app.listen(PORT, () => console.log(`Server is running on localhost:${PORT}`)))
    .catch((error) => console.log(error.message))
