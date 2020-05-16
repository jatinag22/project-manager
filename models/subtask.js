const mongoose = require('mongoose')
const Task = require('./task')
const { taskFields } = require('../utils/taskFieldsUtil')

const subtaskScema = new mongoose.Schema({
    ...taskFields,
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

subtaskScema.pre('save', async function(next) {
    try {
        if(this.isModified('completed')) {
            const Task = require('./task')
            const task = await Task.findById(this.task)
            if(this.completed) {
                this.completedAt = Date.now()
                task.progress.current++
            } else {
                this.completedAt = undefined
                task.progress.current--
            }
            await task.save()
        }
        next()
    } catch (e) {
        next(e)
    }
})

subtaskScema.pre('remove', async function(next) {
    try {
        const task = await Task.findById(this.task)
        if(this.completed) {
            task.progress.current--
        }
        task.progress.total--
        await task.save()
        next()
    } catch (e) {
        next(e)
    }
})

const Subtask = mongoose.model('Subtask', subtaskScema)

module.exports = Subtask