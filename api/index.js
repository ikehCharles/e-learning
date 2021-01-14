const http = require('http')
const app = require('./app')


// set port to listen
port = process.env.PORT || 4000


// app.use(bodyParser)

// const server = http.createServer(app)

app.listen(port, () => {
    console.log(`server listening on ${port}`)
})