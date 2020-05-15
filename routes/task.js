const express = require('express')
const taskController = require('../controllers/task')
const subtaskRouter = require('./subtask')

const router = express.Router()

router.get('/', taskController.findTasks)
router.get('/:id', taskController.findTaskById)
router.post('/', taskController.createTask)
router.patch('/:id', taskController.updateTask)
router.delete('/:id', taskController.deleteTask)

router.use('/:id/subtasks', subtaskRouter)

module.exports = router