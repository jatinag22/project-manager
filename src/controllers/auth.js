const User = require('../models/user')

exports.login = async (req, res, next) => {
    if(req.user) {
        return res.send({user, token})
    }
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch(e) {
        e.status = 400
        next(e)
    }
}

exports.signup = async (req, res, next) => {
    if(req.user) {
        return res.send({user, token})
    }
    const user = new User(req.body)
    try {
        await user.save()
        res.status(201).send({user})
    } catch(e) {
        if(e.code == 11000) {
            e.message = "Username/email already exists!"
        }
        e.status = 400
        next(e)
    }
}

exports.logout = async (req, res, next) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {return token.token != req.token})
        await req.user.save()
        res.send()
    } catch (e) {
        next(e)
    }
}

exports.logoutAll = async(req, res, next) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        next(e)
    }
}