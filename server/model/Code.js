import mongoose, { Schema } from 'mongoose'

const codeSchema = mongoose.Schema({
    code:{
        type: Number,
        required: true
    }
})

const Code = mongoose.model('Code', codeSchema)

export default Code