import mongoose from "mongoose";

const bookSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    content:{
        type: String,
        requierd: true
    },
    _id:{
        type: String,
        required: true
    }
})

const Book = mongoose.model('Book', bookSchema)
export default Book