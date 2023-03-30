import Book from "../model/Book.js"
import { ObjectId } from "bson"
import moment from "moment"
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
    if(req.body.bookId == null){
        const book = await Book.findOneAndDelete({"_id": req.body.id})
    }else{
        const book = await Book.findOneAndDelete({"_id": req.body.bookId})
    }
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
    }else if(req.body.book){
        const toAdd = req.body.book
        const newBook = {
            name: toAdd.name,
            author: toAdd.author,
            bookCount: 1,
            _id: toAdd._id
        }
        const book = new Book(newBook)
        await book.save()
        console.log(1);
        return res.sendStatus(201)
    }
    return res.sendStatus(404)
}

export const removeBook = async (req, res) => {
    let book
    let id
    if(req.body.bookId != null){
        book = await Book.findOne({"_id": req.body.bookId})
        id = req.body.bookId
    }else{
        book = await Book.findOne({"_id": req.body.id})
        id = req.body.id
    }
    if(book){
        if(req.body.count == null){
            book = await Book.findOneAndUpdate({"_id": id}, {$set: {bookCount: book.bookCount-1}})
        }else{
            if(book.bookCount < req.body.count){
                return res.sendStatus(400)
            }
            book = await Book.findOneAndUpdate({"_id": id}, {$set: {bookCount: book.bookCount-req.body.count}})
        }
        if(book.bookCount <= 1){
            deleteBook(req, res)
        }else{
            return res.sendStatus(201)
        }
    }else{
        return res.sendStatus(404)
    }
}

export const expired = async (req, res) => {
    const user = await User.find({})
    let time = new Date()
    let expired = [] 
    for(let i = 0;i<user.length;i++){
        for(let j = 0;j<user[i].books.length;j++){
            let expDate = new Date(user[i].books[j][1]).getTime()
            expDate = new Date(expDate+14*24*60*60*1000)
            if(expDate < time){
                // console.log(user[i].books[j]);
                expired.push({"user": user[i], "books": user[i].books[j]})
            }
        }
    }
    res.status(200).json(expired)
}