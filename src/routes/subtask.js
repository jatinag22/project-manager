const express = require('express')
const subtaskController = require('../controllers/subtask')

const router = express.Router({mergeParams: true})

router.get('/', subtaskController.findSubtasks)
router.get('/:sid', subtaskController.findSubtaskById)
router.post('/', subtaskController.createSubtask)
router.patch('/:sid', subtaskController.updateSubtask)
router.delete('/:sid', subtaskController.deleteSubtask)

module.exports = router