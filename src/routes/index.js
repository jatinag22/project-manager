const express = require('express')
const auth = require('../middleware/auth')
const userRouter = require('./user')
const projectRouter = require('./project')
const authRouter = require('./auth')
const router = express.Router()

router.use('/auth', authRouter)
router.use('/users', auth, userRouter)
router.use('/projects', auth, projectRouter)

module.exports = router