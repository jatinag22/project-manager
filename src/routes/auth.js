const express = require('express')
const auth = require('../middleware/auth')
const authController = require('../controllers/auth')

const router = express.Router()

router.post('/login', authController.login)
router.post('/signup', authController.signup)
router.post('/logout', auth, authController.logout)
router.post('/logoutAll', auth, authController.logoutAll)

module.exports = router