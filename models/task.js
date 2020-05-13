const mongoose = require('mongoose')

const taskFields = {
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    due: {
        type: Date
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date
    }
}

const subtaskScema = new mongoose.Schema({
    ...taskFields
}, {
    timestamps: true
})

const taskSchema = new mongoose.Schema({
    ...taskFields,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subtasks: [subtaskScema]
}, {
    timestamps: true
})

taskSchema.pre('save', function(next) {
    if(this.isModified('completed')) {
        if(this.completed) {
            this.completedAt = Date.now()
        } else {
            this.completedAt = undefined
        }
    }
    next()
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task