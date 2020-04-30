const express = require('express')
const userRouter = require('./user')
const taskRouter = require('./task')
const authRouter = require('./auth')
const router = express.Router()

router.use('/auth', authRouter)
router.use('/users', userRouter)
router.use('/tasks', taskRouter)

module.exports = router