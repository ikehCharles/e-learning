const bcrypt = require("bcrypt")
const students = require("../model/studentModel");
const router = require("express").Router()
const passport = require('passport')
const express = require('express')
const app = express();
const issueJwt = require('../utils/issueAuth')
const saltRounds = parseInt(process.env.saltRounds)
const auth = require('../utils/verifyAuth')




router.post("/register", async(req, res, next) => {
    // check if student exist already
    students.getStudent(req.body, (err, studentData) => {
        if (err) throw err;
        if (studentData) return res.json({ status: false, message: "User already exist" });
        bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
            if (err) return res.json({ err });
            if (!hash) return res.json({ status: false, message: "Unable to hash" })
            req.body.password = hash;
            students.insertStudent(req.body, (err, studentData) => {
                if (err) return res.json(err.message)
                console.log(Object.entries(studentData).length)
                if (!Object.entries(studentData).length) return res.json({ "status": false });
                return res.json(studentData)
            })
        })
    })
})
router.post("/login", async(req, res) => {
    students.getStudent(req.body, (err, student) => {
        if (err) throw err;
        if (!student) return res.json({ status: false, message: "user does not exist" })
            // console.log(student)
        if (student) {
            // console.log(student.password, req.body)
            bcrypt.compare(req.body.password, student.password, (err, result) => {
                if (err) throw err;
                if (result) {
                    const jwt = issueJwt(student, 'student')
                    res.json({ jwt: jwt })
                }
            })
        }
    })
})
router.get("/logout", async(req, res) => {
    req.logout()
    res.send({ authenticated: req.isAuthenticated() })
})
router.get("/", auth, async(req, res, next) => {
    console.log(req.userData)
    res.json(req.userData)

})

module.exports = router