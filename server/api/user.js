import express from "express"

const router = express.Router()

// ! ZAVRSI OVO MAJMUNE(user login)
router.post('/', (req, res) => {
    res.redirect('/site')
})

export default router