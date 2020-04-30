const express = require('express')
const Task = require('../models/task')

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find()
        res.send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if(!task) {
            return res.status(404).send({error: 'Task not found'})
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/', async (req, res) => {
    try {
        const task = new Task(req.body)
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        Object.keys(req.body).forEach((key) => task[key] = req.body[key])
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router