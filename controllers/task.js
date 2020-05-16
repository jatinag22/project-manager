const Task = require('../models/task')

exports.findTasks = async (req, res, next) => {
    var match = {}
    var sort = {}

    if(req.query.completed) {
        if(req.query.completed === 'true') match.completed = true
        if(req.query.completed === 'false') match.completed = false
    }

    if(req.query.sort) {
        let parts = req.query.sort.split(':')
        if(parts[1] === 'asc') sort[parts[0]] = 1
        if(parts[1] === 'desc') sort[parts[0]] = -1
    }

    const limit = 10
    const skip = parseInt(req.query.page) * limit
    const options = {
        limit,
        skip,
        sort
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        next(e)
    }
}

exports.findTaskById = async (req, res, next) => {
    try {
        const task = await Task.findOne({_id: req.params.id, members: req.user._id})
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
        task.members.unshift(req.user._id)
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        next(e)
    }
}

exports.updateTask = async (req, res, next) => {
    const allowedUpdates = new Set(['title', 'description', 'due', 'completed'])
    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        if(!task) {
            return next({status: 404, message: 'Task not found!'})
        }
        const updates = Object.keys(req.body).filter(key => allowedUpdates.has(key))
        updates.forEach((key) => task[key] = req.body[key])
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