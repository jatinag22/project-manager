const app = rewuire('./app')

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('Server started on port ' + PORT)
})