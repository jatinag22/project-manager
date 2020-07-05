const Project = require('../models/project')
const Task = require('../models/task')

exports.findTasks = async (req, res, next) => {
    try {
        const project = await Project.findOne({_id: req.params.id, members: req.user._id})
                        .populate('tasks')
                        .exec()
        if(!project) {
            return next({status: 404, message: 'Task not found!'})
        }
        res.send(project.tasks)
    } catch (e) {
        next(e)
    }
}

exports.findTaskById = async (req, res, next) => {
    try {
        const project = await Project.findOne({_id: req.params.id, members: req.user.id})
        if(!project) {
            return next({status: 404, message: 'Task not found!'})
        }
        const task = await Task.findOne({project, _id:req.params.sid})
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
        const project = await Project.findOne({_id: req.params.id, owner: req.user._id})
        if(!project) {
            return next({status: 404, message: 'Task not found!'})
        }
        const task = new Task({
            ...req.body,
            project: req.params.id
        })
        await task.save()
        project.tasks.push(task._id)
        await project.save()
        res.status(201).send(task)
    } catch (e) {
        next(e)
    }
}

exports.updateTask = async (req, res, next) => {
    try {
        let allowedUpdates = new Set(['title', 'description', 'due', 'completed', 'assignee'])
        const project = await Project.findOne({_id: req.params.id, members: req.user.id})
        if(!project) {
            return next({status: 404, message: 'Task not found!'})
        }
        const task = await Task.findOne({_id: req.params.sid, project})
        if(!task) {
            return next({status: 404, message: 'Task not found!'})
        }
        if(project.owner != req.user.id) {
            allowedUpdates.clear()
        }
        if(task.assignee == req.user.id) {
            allowedUpdates.add('completed')
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
        const project = await Project.findOne({_id: req.params.id, owner: req.user._id})
        if(!project) {
            return next({status: 404, message: 'Task not found!'})
        }
        const task = await Project.findOneAndDelete({_id: req.params.sid, project})
        if(!task) {
            return next({status: 404, message: 'Task not found!'})
        }
        res.send(task)
    } catch (e) {
        next(e)
    }
}