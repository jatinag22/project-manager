const express = require('express')
const auth = require('../middleware/auth')
const userRouter = require('./user')
const taskRouter = require('./task')
const authRouter = require('./auth')
const router = express.Router()

router.use('/auth', authRouter)
router.use('/users', auth, userRouter)
router.use('/tasks', auth, taskRouter)

module.exports = router