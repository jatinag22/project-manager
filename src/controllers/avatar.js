const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')

exports.upload = multer({
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
        res.set('Content-Type', 'image/png')
        res.send(req.user.avatar)
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