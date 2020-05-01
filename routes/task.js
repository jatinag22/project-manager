const express = require('express')
const taskController = require('../controllers/task')

const router = express.Router()

router.get('/', taskController.findTasks)
router.get('/:id', taskController.findTaskById)
router.post('/', taskController.createTask)
router.patch('/:id', taskController.updateTask)
router.delete('/:id', taskController.deleteTask)

module.exports = router