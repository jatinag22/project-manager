const express = require('express')
const indexRouter = require('./routes')
const error = require('./middleware/error')

const app = express()
app.use(express.json())

app.use('/api', indexRouter)

app.use((req, res, next) => {
    let err = new Error('Not Found!')
    err.status = 404
    next(err)
})

app.use(error)

module.exports = app