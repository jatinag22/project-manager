const express = require('express')
const auth = require('../middleware/auth')
const guest = require('../middleware/guest')
const authController = require('../controllers/auth')

const router = express.Router()

router.post('/login', guest, authController.login)
router.post('/signup', guest, authController.signup)
router.post('/logout', auth, authController.logout)
router.post('/logoutAll', auth, authController.logoutAll)

module.exports = router