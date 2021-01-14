const bcrypt = require("bcrypt")
const lecturers = require("../model/lecturerModel");
const courses = require("../model/courseModel");
const router = require("express").Router()
const passport = require('passport')
require('dotenv').config();
const saltRounds = parseInt(process.env.saltRounds)
const issueJwt = require('../utils/issueAuth')
const auth = require('../utils/verifyAuth')
const fs = require("fs");
const path = require("path")




router.post("/register", async(req, res, next) => {
    // check if lecturer exist already
    lecturers.getLecturer(req.body, (err, lecturerData) => {
        if (err) throw err;
        if (lecturerData) return res.json({ status: false, message: "Lecturer already exist" });
        bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
            if (err) return res.json({ err });
            if (!hash) return res.json({ status: false, message: "Unable to hash" })
            req.body.password = hash;
            lecturers.insertlecturer(req.body, (err, lecturerData) => {
                if (err) return res.json(err.message)
                console.log(Object.entries(lecturerData).length)
                if (!Object.entries(lecturerData).length) return res.json({ "status": false });
                return res.json(lecturerData)
            })
        })
    })
})
router.post("/login", async(req, res) => {
    lecturers.getLecturer(req.body, (err, lecturer) => {
        // console.log(student)
        if (lecturer) {
            // console.log(student.password, req.body)
            bcrypt.compare(req.body.password, lecturer.password, (err, result) => {
                if (err) throw err;
                if (result) {
                    const jwt = issueJwt(lecturer, 'lecturer')
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
    if (req.userData.route == 'lecturer' || 'hod') {
        console.log(req.user)
        lecturers.getLecturers((err, lecturerData) => {
            if (err) return next("error");
            console.log(req.session)
            if (!lecturerData) return res.json({ "status": false });
            return res.json(lecturerData)
        })
    } else {
        res.json({ message: "not authenticated" })
    }
})
router.post("/uploadCourseMaterial", auth, async(req, res, next) => {
    if (req.userData.route == 'lecturer') {
        let sampleFile = req.files.pdf;
        console.log(sampleFile.mimetype)
            // if(sampleFile.mimetype != "video.mp4" || sampleFile.mimetype != ".mp4")
        courses.getCourse(req.body, (err, course) => {
            if (err) throw err;
            if (!course) return res.json({ status: false, message: "course not found", body: req.body })
            if (course.lecturerId == req.userData.sub) {
                // console.log(course.dir)
                const createDir = './uploads' + course.dir
                if (!fs.existsSync(createDir)) {
                    fs.mkdirSync(createDir);
                }
                const uploadPath = path.join(__dirname, '../uploads' + course.dir, sampleFile.name)
                sampleFile.mv(uploadPath, (err) => {
                    if (err) throw err;
                })
            } else {
                return res.json({ status: false, message: "Sorry you are not assigned to this course" })
            }
        })
    } else {
        res.json({ message: "not authenticated" })
    }
})

module.exports = router