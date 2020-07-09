require('./mongoose')
const app = require('./app')
const morgan = require('morgan')
app.use(morgan('tiny'))

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('Server started on port ' + PORT)
})