const Project = require('../models/project')

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
            path: 'projects',
            match,
            options
        }).execPopulate()
        res.send(req.user.projects)
    } catch (e) {
        next(e)
    }
}

exports.findTaskById = async (req, res, next) => {
    try {
        const project = await Project.findOne({_id: req.params.id, members: req.user._id})
        if(!project) {
            return next({status: 404, message: 'Task not found!'})
        }
        res.send(project)
    } catch (e) {
        next(e)
    }
}

exports.createTask = async (req, res, next) => {
    try {
        const project = new Project({
            ...req.body,
            owner: req.user._id
        })
        project.members.unshift(req.user._id)
        await project.save()
        res.status(201).send(project)
    } catch (e) {
        next(e)
    }
}

exports.updateTask = async (req, res, next) => {
    const allowedUpdates = new Set(['title', 'description', 'due', 'completed', 'owner'])
    try {
        const project = await Project.findOne({_id: req.params.id, owner: req.user._id})
        if(!project) {
            return next({status: 404, message: 'Task not found!'})
        }
        const updates = Object.keys(req.body).filter(key => allowedUpdates.has(key))
        updates.forEach((key) => project[key] = req.body[key])
        await project.save()
        res.send(project)
    } catch (e) {
        next(e)
    }
}

exports.deleteTask = async (req, res, next) => {
    try {
        const project = await Project.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!project) {
            return next({status: 404, message: 'Task not found!'})
        }
        res.send(project)
    } catch (e) {
        next(e)
    }
}