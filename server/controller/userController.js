import bcrypt from "bcrypt"
import User from "../model/User.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

export const loginUser = async (req, res) => {
    const user = await User.findOne({email: req.body.email})
    if(user == null){
        return res.status(404).json({"error": "No user found"})
    }

    if(!await bcrypt.compare(req.body.password, user.password)){
        res.status(401).json({"error": "Wrong password"})
    }

    const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET)
    res.status(200).json({"accessToken":accessToken})
}

export const registerUser = async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10) 
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword 
    }

    const newUser = new User(user)

    await newUser.save()

    res.status(201).json(newUser)
}
