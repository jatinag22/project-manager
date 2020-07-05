const express = require('express')
const taskController = require('../controllers/task')

const router = express.Router({mergeParams: true})

router.get('/', taskController.findTasks)
router.get('/:sid', taskController.findTaskById)
router.post('/', taskController.createTask)
router.patch('/:sid', taskController.updateTask)
router.delete('/:sid', taskController.deleteTask)

module.exports = router