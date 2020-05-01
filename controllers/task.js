const Task = require('../models/task')

exports.findTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find({owner: req.user._id})
        res.send(tasks)
    } catch (e) {
        next(e)
    }
}

exports.findTaskById = async (req, res, next) => {
    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        if(!task) {
            return next({status: 404, message: 'Task not found!'})
        }
        res.send(task)
    } catch (e) {
        next(e)
    }
}

exports.createTask = async (req, res, next) => {
    try {
        const task = new Task({
            ...req.body,
            owner: req.user._id
        })
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        next(e)
    }
}

exports.updateTask = async (req, res, next) => {
    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        if(!task) {
            return next({status: 404, message: 'Task not found!'})
        }
        Object.keys(req.body).forEach((key) => task[key] = req.body[key])
        await task.save()
        res.send(task)
    } catch (e) {
        next(e)
    }
}

exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!task) {
            return next({status: 404, message: 'Task not found!'})
        }
        res.send(task)
    } catch (e) {
        next(e)
    }
}