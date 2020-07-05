const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    let token = '', unverifiedToken = ''
    try {
        token = req.header('Authorization').replace('Bearer ', '')
        unverifiedToken = jwt.decode(token)
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})
        if(!user) {
            throw new Error()
        }
        req.user = user
        req.token = token
        next()
    } catch(e) {
        e.message = 'Unauthorized'
        e.status = 401
        if(e.name === 'TokenExpiredError') {
            e.message = 'Please login again!'
            let user = await User.findById(unverifiedToken._id)
            user.tokens = user.tokens.filter((tokenFromArray) => {return tokenFromArray.token != token})
            await user.save()
        }
        next(e)
    }
}

module.exports = auth