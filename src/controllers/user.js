const User = require('../models/user')

exports.findUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user) {
            let e = new Error()
            e.status = 404
            e.message = 'User not found!'
            throw e
        }
        res.send(user)
    } catch (e) {
        next(e)
    }
}

exports.updateUser = async (req, res, next) => {
    const allowedUpdates = new Set(['name', 'password'])
    try {
        const user = req.user
        // if(user._id != req.params.id) {
        //     return next({status:403, message:'Invalid User ID!'})
        // }
        const updates = Object.keys(req.body).filter(key => allowedUpdates.has(key))
        updates.forEach((key) => user[key] = req.body[key])
        await user.save()
        res.send(user)
    } catch(e) {
        next(e)
    }

}

exports.deleteUser = async (req, res, next) => {
    try {
        // if(req.user._id != req.params.id) {
        //     return next({status:403, message:'Invalid User ID!'})
        // }
        await req.user.remove()
        res.send(req.user)
    } catch(e) {
        next(e)
    }
}