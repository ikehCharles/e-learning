const express = require('express')
const app = express();
const fileUpload = require('express-fileupload')
const studentRoute = require("./router/studentRoute")
const lecturerRoute = require("./router/lecturerRoute")
const courseRoute = require("./router/courseRoute")
const hodRoute = require("./router/hodRoute")
const db = require('./utils/db')
require('dotenv').config()





app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(fileUpload())

// middleware routes
app.use("/students", studentRoute)
app.use("/lecturers", lecturerRoute)
app.use("/courses", courseRoute)
app.use("/hods", hodRoute)



app.get("/", (req, res) => {
    res.send(res);
})

// error middleware routes
app.use((err, req, res, next) => {
    console.log(req)
    res.send("Something went wrong")
    if (err) {
        if (res.status === 404) {
            res.send("page not found")
        }
    }
})



module.exports = app;