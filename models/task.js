const mongoose = require('mongoose')
const { taskFields } = require('../utils/taskFieldsUtil')

const taskSchema = new mongoose.Schema({
    ...taskFields,
    progress: {
        current: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            default: 1
        }
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subtasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subtask'
    }]
}, {
    timestamps: true
})

taskSchema.pre('save', function(next) {
    if(this.subtasks.length == 0) {
        this.progress.total = 1
    } else {
        this.progress.total = this.subtasks.length
    }

    if(!this.isModified('completed') && this.progress.current == this.progress.total) {
        this.completed = true
    }

    if(this.isModified('completed')) {
        if(this.completed) {
            this.completedAt = Date.now()
            this.progress.current = this.progress.total
        } else {
            if(this.subtasks.length == 0) {
                this.progress.current = 0
            }
            this.completedAt = undefined
        }
    }

    next()
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task