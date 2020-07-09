const mongoose = require('mongoose')
const Task = require('./task')
const { taskFields } = require('../utils/taskFieldsUtil')

const projectSchema = new mongoose.Schema({
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
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }]
}, {
    timestamps: true
})

projectSchema.pre('save', async function(next) {
    try {
        if(this.tasks.length === 0) {
            this.progress.total = 1
        } else {
            this.progress.total = this.tasks.length
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
                await Task.updateMany(
                    {task: this._id, completed: false},
                    {completed: true, completedAt: Date.now()}
                )
            } else {
                this.progress.current = 0
                this.completedAt = undefined
                await Task.updateMany(
                    {task: this._id, completed: true},
                    {completed: false, completedAt: undefined}
                )
            }
        }
    
        next()
    } catch (e) {
        next(e)
    }
})

projectSchema.pre('remove', async function() {
    try {
        await Task.deleteMany({task: this._id})
        next()
    } catch (e) {
        next(e)
    }
})

const Project = mongoose.model('Project', projectSchema)

module.exports = Project