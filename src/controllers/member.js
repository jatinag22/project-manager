const Project = require('../models/project')

exports.viewMembers = async (req, res, next) => {
    try {
        const project = await project.findOne({_id: req.params.id, members: req.user.id})
        if(!project) {
            return next({status: 404, message: 'Project not found!'})
        }
        await project.populate('members').execPopulate()
        res.send(project.members)
    } catch (e) {
        next(e)
    }
}

exports.updateMembers = async (req, res, next) => {
    try {
        const project = await Project.findOne({_id: req.params.id, owner: req.user._id})
        if(!project) {
            return next({status: 404, message: 'Project not found!'})
        }
        if(req.body.operation === 'add') {
            project.members.addToSet(...req.body.members)
        } else if(req.body.operation === 'remove') {
            const members = new Set(req.body.members)
            members.delete(project.owner.toString())
            project.members = project.members.filter(member => !members.has(member.toString()))
        }
        await project.save()
        res.send(project.members)
    } catch (e) {
        next(e)
    }
}