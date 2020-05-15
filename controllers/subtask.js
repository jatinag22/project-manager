const Task = require('../models/task')
const Subtask = require('../models/subtask')

exports.findSubtasks = async (req, res, next) => {
    const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
                        .populate('subtasks')
                        .exec()
    res.send(task.subtasks)
}

exports.findSubtaskById = async (req, res, next) => {
    const subtask = await Subtask.findOne({task: req.params.id, _id:req.params.sid})
    if(!subtask) {
        return next({status: 404, message: 'Task not found!'})
    }
    res.send(subtask)
}

exports.createSubtask = async (req, res, next) => {
    const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
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
    const subtask = await Subtask.findOne({_id: req.params.sid, task: req.params.id})
    if(!subtask) {
        return next({status: 404, message: 'Task not found!'})
    }
    Object.keys(req.body).forEach((key) => subtask[key] = req.body[key])
    await subtask.save()
    res.send(subtask)
}

exports.deleteSubtask = async (req, res, next) => {
    const subtask = await Task.findOneAndDelete({_id: req.params.sid, task: req.params.id})
    if(!subtask) {
        return next({status: 404, message: 'Task not found!'})
    }
    res.send(subtask)
}