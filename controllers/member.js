const Task = require('../models/task')

exports.viewMembers = async (req, res, next) => {
    const task = await Task.findOne({_id: req.params.id, members: req.user.id})
    if(!task) {
        return next({status: 404, message: 'Task not found!'})
    }
    await task.populate('members').execPopulate()
    res.send(task.members)
}

exports.updateMembers = async (req, res, next) => {
    const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
    if(!task) {
        return next({status: 404, message: 'Task not found!'})
    }
    if(req.body.operation === 'add') {
        task.members.addToSet(...req.body.members)
    } else if(req.body.operation === 'remove') {
        const members = new Set(req.body.members)
        members.delete(task.owner.toString())
        task.members = task.members.filter(member => !members.has(member.toString()))
    }
    await task.save()
    res.send(task.members)
}