const express = require('express')
const auth = require('../middleware/auth')
const avatarController = require('../controllers/avatar')

const router = express.Router()

router.post('/:id/avatar', auth, avatarController.upload.single('avatar'), avatarController.uploadAvatar)
router.get('/:id/avatar', auth, avatarController.getAvatar)
router.delete('/:id/avatar', auth, avatarController.deleteAvatar)

module.exports = router