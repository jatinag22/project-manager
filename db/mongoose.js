const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/task-manager-new', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});