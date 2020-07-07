const express = require('express')
const userController = require('../controllers/user')
const avatarRouter = require('./avatar')

const router = new express.Router()

router.get('/me', (req, res, next) => {
    res.send(req.user)
})

router.get('/:id', userController.findUser)
router.patch('/me', userController.updateUser)
router.delete('/me', userController.deleteUser)

router.use(avatarRouter)

module.exports = router