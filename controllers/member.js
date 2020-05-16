const Task = require('../models/task')

exports.viewMembers = async (req, res, next) => {
    const task = await Task.findOne({_id: req.params.id, members: req.user.id})
    if(!task) {
        return next({status: 404, message: 'Task not found!'})
    }
    await task.populate('members').execPopulate()
    res.send(task.members)
}

exports.addMembers = async (req, res, next) => {
    const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
    if(!task) {
        return next({status: 404, message: 'Task not found!'})
    }
    task.members.addToSet(...req.body.members)
    await task.save()
    res.send(task.members)
}

exports.removeMembers = async (req, res, next) => {
    const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
    if(!task) {
        return next({status: 404, message: 'Task not found!'})
    }
    const members = new Set(req.body.members)
    members.delete(task.owner.toString())
    task.members = task.members.filter(member => !members.has(member.toString()))
    await task.save()
    res.send(task.members)
}