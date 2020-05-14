const mongoose = require('mongoose')
const { taskFields } = require('../utils/taskFieldsUtil')

const subtaskScema = new mongoose.Schema({
    ...taskFields,
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    }
}, {
    timestamps: true
})

subtaskScema.pre('save', function(next) {
    if(this.isModified('completed')) {
        const parent = parent()
        if(this.completed) {
            this.completedAt = Date.now()
            parent.progress.current++
        } else {
            this.completedAt = undefined
            parent.progress.current--
        }
    }
    next()
})

subtaskScema.pre('remove', function(next) {
    const parent = parent()
    if(this.completed) {
        parent.progress.current--
    }
    parent.progress.total--
    next()
})

const Subtask = mongoose.model('Subtask', subtaskScema)

module.exports = Subtask