import Post from "../model/Post.js"
import { ObjectId } from "bson"

export const getPost = async (req, res) => {
    try {
        if(req.query.id == null){
            throw new Error("No id inputed")
        }
        const post = await Post.findOne({"_id": req.query.id})
        if(post){
            res.status(200).json(post)
        }else{
            throw new Error("Post not found")
        }
    } catch (error) {
        res.status(500).json({error: error.message})        
    }
}

export const getPosts = async (req, res) => {
    const posts = await Post.find({})
    res.status(200).json(posts)
}

export const createPost = async (req, res) => {
    try {
        if(req.body.name == null || req.body.content == null){
            throw new Error("Not enough information provided")
        }

        const newPost = {
            name: req.body.name,
            content: req.body.content,
            _id: new ObjectId().toHexString()
        }
        const post = new Post(newPost)

        await post.save()
        res.status(201).redirect('/site')
    } catch (error) {
        res.status(500).json({error: error.message})        
    }
}

export const deletePost = async (req, res) => {
    try {
        if(req.query.id == null){
            throw new Error("No id inputed")
        }
        const post = await Post.findByIdAndDelete({"_id": req.query.id})
        if(post){
            res.status(200).redirect('/site') 
        }else{
            throw new Error('Post not found')
        }
    } catch (error) {
        res.status(500).json({error: error.message})        
    }
}