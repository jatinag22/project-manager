const express = require('express')
const morgan = require('morgan')
const indexRouter = require('./routes')
const errorUtil = require('./utils/errorUtil')

const app = express()
app.use(express.json())
app.use(morgan('tiny'))

app.use('/api', indexRouter)

app.use((req, res, next) => {
    let error = new Error('Not Found!')
    error.status = 404
    next(error)
})

app.use(errorUtil)

module.exports = app