import Book from "../model/Book.js"
import { ObjectId } from "bson"

export const getBooks = async (req, res) => {
    if(req.body.id == null){
        const books = await Book.find({})
        return res.status(200).json(books)
    }
    
    const book = await Book.find({"_id": req.body.id})
    if(!book){
        return res.sendStatus(404)
    }
    return res.status(200).json(book)
}

export const createBook = async (req, res) => {
    const newBook = {
        name: req.body.name,
        content: req.body.content,
        _id: new ObjectId().toHexString()
    }
    const book = new Book(newBook)
    await book.save()

    res.sendStatus(201)
}

export const deleteBook = async (req, res) => {
    const book = await Book.findByIdAndDelete({"_id": req.body.id})
    console.log(book);
    if(book){
        return res.sendStatus(201) 
    }
    return res.sendStatus(404)
}