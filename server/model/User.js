import mongoose, { Schema } from 'mongoose'

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    admin:{
        type: Boolean,
        default: false
    },
    books:{
        type: [Array, Date],
        default: []
    },
    expiredBooks:{
        type: Number,
        default: 0        
    },
    reservedBooks: {
        type: [Array, Date],
        default: []
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
})

const User = mongoose.model('User', userSchema)

export default User