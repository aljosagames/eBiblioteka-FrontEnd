import Book from "../model/Book.js"
import { ObjectId } from "bson"

export const getBooks = async (req, res) => {
    const books = await Book.find({})
    return res.status(200).json(books)
}

export const getBook = async (req, res) => {
    try {
        const book = await Book.findOne({"_id": req.body.id})
        if(book.length != 0){
            return res.status(200).json(book)
        }
    } catch (error) {
        return res.sendStatus(404)
    }
}

export const createBook = async (req, res) => {
    try {
        const newBook = {
            name: req.body.name,
            author: req.body.author,
            bookCount: req.body.bookCount,
            _id: new ObjectId().toHexString()
        }
        const book = new Book(newBook)
        await book.save()
        return res.sendStatus(201)
    } catch (error) {
        return res.sendStatus(404)
    }
}

export const deleteBook = async (req, res) => {
    const book = await Book.findOneAndDelete({"_id": req.body.id})
    if(book){
        return res.sendStatus(201) 
    }
    return res.sendStatus(404)
}

export const addBook = async (req, res) => {
    const book = await Book.findOne({"_id": req.body.id})
    if(book){
        await Book.findOneAndUpdate({"_id": req.body.id}, {$set: {bookCount: book.bookCount+1}})
        return res.sendStatus(201)
    }
    return res.sendStatus(404)
}

export const removeBook = async (req, res) => {
    let book = await Book.findOne({"_id": req.body.id})
    if(book){
        book = await Book.findOneAndUpdate({"_id": req.body.id}, {$set: {bookCount: book.bookCount-1}})
        if(book.bookCount <= 1){
            deleteBook(req, res)
            return
        }
        return res.sendStatus(201)
    }
    return res.sendStatus(404)
}

export const updateBook = async (req, res) => {
    let book;
    if(req.body.name != null){
        book = await Book.findOneAndUpdate({"_id": req.body.id}, {$set: {"name": req.body.name}})
    }else if(req.body.author != null){
        book = await Book.findOneAndUpdate({"_id": req.body.id}, {$set: {"author": req.body.author}})
    }else{
        return req.sendStatus(400)
    }

    if(book){
        return res.sendStatus(200)
    }
    return res.sendStatus(404)
}