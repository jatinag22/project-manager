const express = require('express')
const auth = require('../middleware/auth')
const userController = require('../controllers/user')

const router = new express.Router()
router.use(auth)

router.get('/', (req, res, next) => {
    res.redirect('./users/' + req.user._id)
})

router.get('/:id', userController.findUser)
router.patch('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)

module.exports = router