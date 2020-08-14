const jwt = require('jsonwebtoken')
const User = require('../models/user')

const guest = async (req, res, next) => {
    try {
        if(req.header('Authorization')) {
            const token = req.header('Authorization').replace('Bearer ', '')
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const user = await User.findOne({_id: decoded._id, 'tokens.token': token})
            if(user) {
                next({status:400, message:'Please Logout!'})
                req.user = user
                req.token = token
            }
        }
        next()
    } catch(e) {
        next(e)
    }
}

module.exports = guest