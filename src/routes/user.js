const express = require('express')
const userController = require('../controllers/user')
const avatarRouter = require('./avatar')

const router = new express.Router()

router.get('/', (req, res, next) => {
    res.send(req.user)
})

router.get('/:id', userController.findUser)
router.patch('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)

router.use(avatarRouter)

module.exports = router