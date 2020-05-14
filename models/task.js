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
    subtasks: [subtaskScema]
}, {
    timestamps: true
})

taskSchema.pre('save', function(next) {
    if(this.subtasks.length == 0) {
        this.progress.total = 1
    } else {
        this.progress.total = this.subtasks.length
    }

    if(this.progress.current == this.progress.total) {
        this.completed = true
    }

    if(this.isModified('completed')) {
        if(this.completed) {
            this.completedAt = Date.now()
            this.progress.current = this.progress.total
        } else {
            this.completedAt = undefined
        }
    }

    next()
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

const Task = mongoose.model('Task', taskSchema)

module.exports = Task