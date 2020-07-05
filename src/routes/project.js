const express = require('express')
const projectController = require('../controllers/project')
const taskRouter = require('./task')
const memberRouter = require('./member')

const router = express.Router()

router.get('/', projectController.findProjects)
router.get('/:id', projectController.findProjectById)
router.post('/', projectController.createProject)
router.patch('/:id', projectController.updateProject)
router.delete('/:id', projectController.deleteProject)

router.use('/:id/tasks', taskRouter)

router.use('/:id/members', memberRouter)

module.exports = router