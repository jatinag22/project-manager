error = (err, req, res, next) => {
    res.status(err.status || 500)
    .send({
        error:{
            message: err.message || 'Oops, something went wrong!'
        }
    })
}

module.exports = error