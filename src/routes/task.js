const express = require('express')
const taskController = require('../controllers/task')
const subtaskRouter = require('./subtask')
const memberRouter = require('./member')

const router = express.Router()

router.get('/', taskController.findTasks)
router.get('/:id', taskController.findTaskById)
router.post('/', taskController.createTask)
router.patch('/:id', taskController.updateTask)
router.delete('/:id', taskController.deleteTask)

router.use('/:id/subtasks', subtaskRouter)

router.use('/:id/members', memberRouter)

module.exports = router