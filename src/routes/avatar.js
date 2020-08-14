const express = require('express')
const auth = require('../middleware/auth')
const avatarController = require('../controllers/avatar')

const router = express.Router()

router.post('/me/avatar', avatarController.upload.single('avatar'), avatarController.uploadAvatar)
router.get('/:id/avatar', avatarController.getAvatar)
router.delete('/me/avatar', avatarController.deleteAvatar)

module.exports = router