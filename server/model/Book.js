import mongoose from "mongoose";

const bookSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    author:{
        type: String,
        requierd: true
    },
    bookCount:{
        type: Number,
        required: true
    },
    _id:{
        type: String,
        required: true
    }
})

const Book = mongoose.model('Book', bookSchema)
export default Book