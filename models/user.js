const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Invalid email!')
            }
        }
    },
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 7
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

userSchema.methods.toJSON = function() {
    const userObject = this.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET, {expiresIn: '7d'})
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    if(!user) {
        throw new Error('Invalid credentials')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) {
        throw new Error('Invalid credentials')
    }
    return user
}

userSchema.pre('save', async function(next) {
    try {
        const user = this
        if(user.isModified('password')) {
            user.password = await bcrypt.hash(user.password, 8)
        }
        next()
    } catch (e) {
        next(e)
    }
})

userSchema.pre('remove', async function() {
    await Task.deleteMany({owner: this._id})
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User