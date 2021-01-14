const bcrypt = require("bcrypt")
const hods = require("../model/hodModel");
const lecturers = require("../model/lecturerModel")
const courses = require("../model/courseModel")
const router = require("express").Router()
require('dotenv').config();
const saltRounds = parseInt(process.env.saltRounds)
const issueJwt = require('../utils/issueAuth')
const auth = require('../utils/verifyAuth')




router.post("/register", async(req, res, next) => {
    // check if lecturer exist already
    hods.getHod(req.body, (err, hodData) => {
        if (err) throw err;
        if (hodData) return res.json({ status: false, message: "Hod already exist" });
        bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
            if (err) return res.json({ err });
            if (!hash) return res.json({ status: false, message: "Unable to hash" })
            req.body.password = hash;
            hods.insertHod(req.body, (err, hodData) => {
                if (err) return res.json(err.message)
                console.log(Object.entries(hodData).length)
                if (!Object.entries(hodData).length) return res.json({ "status": false });
                return res.json(hodData)
            })
        })
    })
})
router.post("/login", async(req, res) => {
    hods.getHod(req.body, (err, hod) => {
        if (err) throw err;
        if (!hod) return res.json({ status: false, message: "hod does not exist" });
        if (hod) {
            bcrypt.compare(req.body.password, hod.password, (err, result) => {
                if (err) throw err;
                if (!result) return res.json({ status: false, message: "Invalid password" })
                if (result) {
                    const jwt = issueJwt(hod, 'hod')
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
    if (req.userData.route == 'hod') {
        hods.getHods((err, hodData) => {
            if (err) return next("error");
            if (!hodData) return res.json({ "status": false, message: "No hod present" });
            return res.json(hodData)
        })
    } else {
        res.json({ message: "not authenticated" })
    }
})
router.post("/assignLecturer", auth, async(req, res, next) => {
    if (req.userData.route == 'hod') {
        hods.getHodById({ _id: req.userData.sub }, (err, hod) => {
            if (err) throw err;
            if (!hod) return res.json({ status: false, message: "hod not found" })
            courses.getCourse(req.body, (err, course) => {
                if (err) throw err;
                if (!course) return res.json({ status: false, message: "Course not found" })
                if (course.department === hod.department) {
                    courses.updateCourseLecturer(req.body, (err, success) => {
                        if (err) throw err;
                        if (!success) return res.json({ status: false, message: success });
                        req.body.courseId = course._id;
                        lecturers.updateLecturerCourse(req.body, (err, success) => {
                            if (err) throw err;
                            if (!success) return res.json({ status: false, message: "unable to update lecturer collection" })
                            res.json({ status: true, message: "successful" })
                        })
                    })
                } else {
                    res.json({ status: false, message: "You cannot assign to other departments" });
                }
            })
        });
    } else {
        res.json({ message: "not authorized" })
    }
})

module.exports = router