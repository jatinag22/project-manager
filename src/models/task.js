const mongoose = require('mongoose')
const Project = require('./project')
const { taskFields } = require('../utils/taskFieldsUtil')

const taskScema = new mongoose.Schema({
    ...taskFields,
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

taskScema.pre('save', async function(next) {
    try {
        if(this.isModified('completed')) {
            const Project = require('./project')
            const project = await Project.findById(this.project)
            if(this.completed) {
                this.completedAt = Date.now()
                project.progress.current++
            } else {
                this.completedAt = undefined
                project.progress.current--
            }
            await project.save()
        }
        next()
    } catch (e) {
        next(e)
    }
})

taskScema.pre('remove', async function(next) {
    try {
        const project = await Project.findById(this.project)
        if(this.completed) {
            project.progress.current--
        }
        project.progress.total--
        await project.save()
        next()
    } catch (e) {
        next(e)
    }
})

const Task = mongoose.model('Task', taskScema)

module.exports = Task