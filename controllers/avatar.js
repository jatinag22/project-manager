const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')

exports. upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            let error = {status: 400, message: 'Only jpg and png images are allowed.'}
            return cb(error)
        }
        cb(undefined, true)
    }
})

exports.uploadAvatar = async (req, res, next) => {
    try {
        if(req.user._id != req.params.id) {
            let e = new Error('Invalid User ID!')
            e.status = 400
            throw e
        }
        const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
        req.user.avatar = buffer
        await req.user.save()
        res.send()
    } catch(e) {
        next(e)
    }
}

exports.getAvatar = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user) {
            let e = new Error('User not found!')
            e.status = 404
            throw e
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        next(e)
    }
}

exports.deleteAvatar = async (req, res, next) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    } catch (e) {
        next(e)
    }
}