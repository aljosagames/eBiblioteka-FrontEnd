import bcrypt from "bcrypt"
import User from "../model/User.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import Book from "../model/Book.js"
import { addBook, removeBook } from "./bookController.js"
dotenv.config()

export const getUsers = async (req, res) => {
    const users = await User.find({})
    return res.json(users)
}

export const loginUser = async (req, res) => {
    const user = await User.findOne({email: req.body.email})
    if(user == null){
        return res.status(404)
    }
    if(!await bcrypt.compare(req.body.password, user.password)){
        return res.sendStatus(401)
    }

    const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET)
    return res.status(201).json({accessToken: accessToken})
}

export const registerUser = async (req, res) => {
    if(await User.findOne({email: req.body.email})){
        return res.sendStatus(406)
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10) 
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword 
    }
    const newUser = new User(user)
    await newUser.save()

    return res.sendStatus(201)
}

export const deleteUser = async (req, res) => {
    const user = await User.findOneAndDelete({"_id": req.body.id})
    if(user){
        return res.sendStatus(201)
    }
    return res.sendStatus(404)
}

export const updateUser = async (req, res) => {
    let user;
    try {
        if(req.body.email != null){
            user = await User.findOneAndUpdate({"_id": req.body.id}, {$set: {"email": req.body.email}})
        }else if(req.body.name != null){
            user = await User.findOneAndUpdate({"_id": req.body.id}, {$set: {"name": req.body.name}})
        }else if(req.body.password != null){
            user = await User.findOneAndUpdate({"_id": req.body.id}, {$set: {"password": req.body.password}})
        }else{
            return req.sendStatus(400)
        }
    } catch (error) {
        return res.status(404)        
    }

    if(user){
        return res.sendStatus(200)
    }
    return res.sendStatus(404)
}

export const addBookToUser = async (req, res) => {
    const book = await Book.findOne({"name": req.body.name})
    if(!book){
        return res.sendStatus(404)
    }
    let user
    try {
        user = await User.findOne({"_id": req.body.id})
    } catch (error) {
        return res.sendStatus(404)
    }

    if(user.books.includes(book.name)){
        return res.sendStatus(403)
    }

    user = await User.findOneAndUpdate({"_id": req.body.id}, {$push: {books: book.name}})
    return removeBook(req, res)
}

export const removeBookFromUser = async (req, res) => {
    const book = await Book.findOne({"name": req.body.name})
    if(!book){
        return res.sendStatus(404)
    }
    let user
    try {
        user = await User.findOne({"_id": req.body.id})
    } catch (error) {
        return res.sendStatus(404)
    }
    if(!user.books.includes(book.name)){
        return res.sendStatus(403)
    }
    
    user = await User.findOneAndUpdate({"_id": req.body.id}, {$pull: {books: book.name}})
    console.log(1);
    return addBook(req, res)
}