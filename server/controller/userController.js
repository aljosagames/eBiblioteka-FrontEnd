import bcrypt from "bcrypt"
import User from "../model/User.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import Book from "../model/Book.js"
import { addBook, removeBook } from "./bookController.js"
import { emailVerif } from "../emailVerification.js"
import Code from "../model/Code.js"
dotenv.config()

export const getUsers = async (req, res) => {
    const users = await User.find({})
    return res.json(users)
}

export const getUser = async (req, res) => {
    try {
        const user = await User.findOne({"_id": req.body.id})
        return res.status(200).json(user)
    } catch (error) {
        return res.sendStatus(404)
    }
}

export const loginUser = async (req, res) => {
    const user = await User.findOne({email: req.body.email})
    if(user == null){
        return res.sendStatus(404)
    }
    if(!await bcrypt.compare(req.body.password, user.password)){
        return res.sendStatus(401)
    }
    const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET, {expiresIn: "1h"})
    return res.status(201).json({accessToken: accessToken, admin: user.admin, user: user})
}

export const registerUser = async (req, res) => {
    if(await User.findOne({email: req.body.email})){
        return res.sendStatus(406)
    }else{
        let code = Math.floor((Math.random() * 999999) + 100000);
        const newCode = new Code({code:code, email:req.body.email})
        await newCode.save()
        emailVerif(code, req.body.email)
        return res.sendStatus(201)
    }
}

export const verifyUser = async (req, res) => {
    try {
        let code = await Code.findOne({"code": req.body.code})
        if(code.email != req.body.email){
            throw Error
        }
        code = await Code.findOneAndDelete({"code": req.body.code})
        if(!code){
            throw Error
        }
    } catch (error) {
        return res.sendStatus(403)        
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10) 
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    }
    const newUser = new User(user)
    await newUser.save()
    
    loginUser(req, res)
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
        user = await User.findOne({"_id": req.body.id})
        if(!user || req.body.password == null){
            throw Error
        }
        if(!await bcrypt.compare(req.body.password, user.password)){
            return res.sendStatus(403)
        }
    } catch (error) {
        return res.sendStatus(404)
    }
    let code = Math.floor((Math.random() * 999999) + 100000);
    const newCode = new Code({code:code, email:user.email})
    await newCode.save()
    emailVerif(code, user.email)
    return res.sendStatus(201)
}

export const forgotPass = async (req, res) => {
    try {
        let code = Math.floor((Math.random() * 999999) + 100000);
        const newCode = new Code({code:code, email:req.body.email})
        await newCode.save()
        emailVerif(code, req.body.email)
        return res.sendStatus(201)
    } catch (error) {
        return res.sendStatus(404)
    }
}

export const forgotPassVerify = async (req, res) => {
    try {
        let code = await Code.findOne({"code": req.body.code})
        code = await Code.findOneAndDelete({"code": parseInt(req.body.code)})
        if(!code){
            throw Error
        }
    } catch (error) {
        return res.sendStatus(403)
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10) 
    let user = await User.findOne({"email": req.body.email})
    if(!user){
        return res.sendStatus(404)
    }
    user = await User.findOneAndUpdate({"email": req.body.email}, {$set: {"password": hashedPassword}})
    if(user){
        return res.sendStatus(201)
    }
    return res.sendStatus(404)
}

export const changePasswordVerify = async (req, res) => {
    try {
        let code = await Code.findOne({"code": req.body.code})
        code = await Code.findOneAndDelete({"code": parseInt(req.body.code)})
        if(!code){
            throw Error
        }
    } catch (error) {
        return res.sendStatus(403)
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10) 
    let user = await User.findOne({"_id": req.body.id})
    if(!user){
        return res.sendStatus(404)
    }
    user = await User.findOneAndUpdate({"_id": req.body.id}, {$set: {"password": hashedPassword}})
    if(user){
        return res.sendStatus(201)
    }
    return res.sendStatus(404)
}

export const makeAdmin = async (req, res) => {
    try {
        await User.findOneAndUpdate({"_id": req.body.id}, {$set: {admin: true}})
        return res.sendStatus(201)
    } catch (error) {
        return res.sendStatus(404)
    }
}

export const removeAdmin = async (req, res) => {
    try {
        await User.findOneAndUpdate({"_id": req.body.id}, {$set: {admin: false}})
        return res.sendStatus(201)
    } catch (error) {
        return res.sendStatus(404)
    }
}

export const addBookToUser = async (req, res) => {
    const book = await Book.findOne({"_id": req.body.id})
    if(!book){
        return res.sendStatus(404)
    }
    let user
    try {
        user = await User.findOne({"_id": req.body.userId})
        if(!user){
            throw Error
        }
    } catch (error) {
        return res.sendStatus(404)
    }
    try {
        for(let i = 0;i < user.books.length;i++){
            if(user.books[i][0]._id == book._id){
                return res.sendStatus(403)
            }
        }
    } catch (error) {
        
    }

    const time = new Date()
    time.setDate(time.getDate())
    user = await User.findOneAndUpdate({"_id": req.body.userId}, {$push: {books: [book, time]}})
    return removeBook(req, res)
}

export const removeBookFromUser = async (req, res) => {
    let user
    try {
        user = await User.findOne({"_id": req.body.userId})
        if(!user){
            throw Error
        }
    } catch (error) {
        return res.sendStatus(404)
    }
    
    let toRemove = []
    try {
        for(let i = 0;i < user.books.length;i++){
            if(user.books[i][0]._id == req.body.id){
                toRemove = user.books[i]
            }
        }
        if(toRemove.length == 0){
            throw Error
        }
    } catch (error) {   
        return res.sendStatus(404)
    }
    const time = new Date()
    if(toRemove[1].getTime() > time.getTime() + 14*24*60*60*1000){
        user = await User.findOneAndUpdate({"_id": req.body.userId}, {$inc: {"expiredBooks": 1}})
    }
    await addBook(req, res)
    user = await User.findOneAndUpdate({"_id": req.body.userId}, {$pull: {books: toRemove}})
}

export const isAdmin = async (req, res) => {
    let token = req.headers['authorization']
    if(token == null){
        return res.sendStatus(401)
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err){
            return res.sendStatus(410)
        }
        if(!user.admin){
            return res.sendStatus(403)
        }
        return res.sendStatus(200)
    })
}