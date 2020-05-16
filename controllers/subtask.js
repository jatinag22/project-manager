const Task = require('../models/task')
const Subtask = require('../models/subtask')

exports.findSubtasks = async (req, res, next) => {
    const task = await Task.findOne({_id: req.params.id, members: req.user._id})
                        .populate('subtasks')
                        .exec()
    if(!task) {
        return next({status: 404, message: 'Task not found!'})
    }
    res.send(task.subtasks)
}

exports.findSubtaskById = async (req, res, next) => {
    const task = await Task.findOne({_id: req.params.id, members: req.user.id})
    if(!task) {
        return next({status: 404, message: 'Task not found!'})
    }
    const subtask = await Subtask.findOne({task, _id:req.params.sid})
    if(!subtask) {
        return next({status: 404, message: 'Task not found!'})
    }
    res.send(subtask)
}

exports.createSubtask = async (req, res, next) => {
    const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
    if(!task) {
        return next({status: 404, message: 'Task not found!'})
    }
    const subtask = new Subtask({
        ...req.body,
        task: req.params.id
    })
    await subtask.save()
    task.subtasks.push(subtask._id)
    await task.save()
    res.status(201).send(subtask)
}

exports.updateSubtask = async (req, res, next) => {
    let allowedUpdates = new Set(['title', 'description', 'due', 'completed', 'assignee'])
    const task = await Task.findOne({_id: req.params.id, members: req.user.id})
    if(!task) {
        return next({status: 404, message: 'Task not found!'})
    }
    const subtask = await Subtask.findOne({_id: req.params.sid, task})
    if(!subtask) {
        return next({status: 404, message: 'Task not found!'})
    }
    if(task.owner != req.user.id) {
        allowedUpdates.clear()
    }
    if(subtask.assignee == req.user.id) {
        allowedUpdates.add('completed')
    }
    const updates = Object.keys(req.body).filter(key => allowedUpdates.has(key))
    updates.forEach((key) => subtask[key] = req.body[key])
    await subtask.save()
    res.send(subtask)
}

exports.deleteSubtask = async (req, res, next) => {
    const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
    if(!task) {
        return next({status: 404, message: 'Task not found!'})
    }
    const subtask = await Task.findOneAndDelete({_id: req.params.sid, task})
    if(!subtask) {
        return next({status: 404, message: 'Task not found!'})
    }
    res.send(subtask)
}