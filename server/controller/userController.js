import bcrypt from "bcrypt"
import User from "../model/User.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

export const loginUser = async (req, res) => {
    const user = await User.findOne({email: req.body.email})
    if(user == null){
        return res.status(404)
    }
    if(!await bcrypt.compare(req.body.password, user.password)){
        return res.sendStatus(401)
    }

    const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"})
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
