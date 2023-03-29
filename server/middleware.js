import jwt from "jsonwebtoken"
import User from "./model/User.js"

export const authenticateToken = (req, res, next) => {
    let token = req.headers['authorization']
    if(token == null){
        return res.sendStatus(401)
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err){
            return res.sendStatus(410)
        }
        req.user = user
        next()
    })
}

export const authenticateAdmin = (req, res, next) => {
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
        req.user = user
        next()
    })
}