import jwt from "jsonwebtoken"

export const authenticateToken = (req, res, next) => {
    let token = req.headers['authorization']
    if(token == null){
        return res.status(401)
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err){
            return res.sendStatus(403)
        }
        req.user = user
        next()
    })
}