import Book from "../model/Book.js"
import { ObjectId } from "bson"
import User from "../model/User.js"

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
    return res.sendStatus(201) 
}

export const addBook = async (req, res) => {
    const book = await Book.findOne({"_id": req.body.id})
    const user = await User.findOne({"_id": req.body.userId})
    if(book){
        try {
            if(req.body.count == null){
                await Book.findOneAndUpdate({"_id": req.body.id}, {$set: {bookCount: book.bookCount+1}})
            }else{
                await Book.findOneAndUpdate({"_id": req.body.id}, {$set: {bookCount: book.bookCount+req.body.count}})
            }
            return res.sendStatus(201)
        } catch (error) {
            console.log(error);
            return res.sendStatus(404)            
        }
    }else if(user){
        let toAdd
        for(let i = 0;i < user.books.length;i++){
            if(user.books[i][0]._id == req.body.id){
                toAdd = user.books[i][0]
            }
        }
        const newBook = {
            name: toAdd.name,
            author: toAdd.author,
            bookCount: 1,
            _id: toAdd._id
        }
        const book = new Book(newBook)
        await book.save()
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
        }else{
            return res.sendStatus(201)
        }
    }else{
        return res.sendStatus(404)
    }
}