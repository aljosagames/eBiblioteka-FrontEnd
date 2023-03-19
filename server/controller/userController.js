import bcrypt from "bcrypt"
import User from "../model/User.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
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
    req.user = user
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
    if(req.body.email != null){
        user = await User.findByIdAndUpdate({"_id": req.body.id}, {$set: {"email": req.body.email}})
    }else if(req.body.name != null){
        user = await User.findByIdAndUpdate({"_id": req.body.id}, {$set: {"name": req.body.name}})
    }else if(req.body.password != null){
        user = await User.findByIdAndUpdate({"_id": req.body.id}, {$set: {"password": req.body.password}})
    }else{
        return req.sendStatus(400)
    }

    if(user){
        return res.sendStatus(200)
    }
    return res.sendStatus(404)
}