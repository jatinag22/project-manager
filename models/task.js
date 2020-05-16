const mongoose = require('mongoose')
const Subtask = require('./subtask')
const { taskFields } = require('../utils/taskFieldsUtil')

const taskSchema = new mongoose.Schema({
    ...taskFields,
    progress: {
        current: {
            type: Number,
            default: 0,
            required: true
        },
        total: {
            type: Number,
            default: 1,
            required: true
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
    }],
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    }]
}, {
    timestamps: true
})

taskSchema.pre('save', async function(next) {

    if(this.subtasks.length === 0) {
        this.progress.total = 1
    } else {
        this.progress.total = this.subtasks.length
    }

    let flag = true
    if(!this.isModified('completed')) {
        if(this.progress.current === this.progress.total) {
            if(!this.completed) {
                this.completed = true
                this.completedAt = Date.now()
                flag = false
            }
        } else {
            if(this.completed) {
                this.completed = false
                this.completedAt = undefined
                flag = false
            }
         
        }
    }

    if(this.isModified('completed') && flag) {
        if(this.completed) {
            this.completedAt = Date.now()
            this.progress.current = this.progress.total
            await Subtask.updateMany(
                {task: this._id, completed: false},
                {completed: true, completedAt: Date.now()}
            )
        } else {
            this.progress.current = 0
            this.completedAt = undefined
            await Subtask.updateMany(
                {task: this._id, completed: true},
                {completed: false, completedAt: undefined}
            )
        }
    }

    next()
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task