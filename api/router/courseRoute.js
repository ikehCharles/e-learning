const courses = require("../model/courseModel");
const router = require("express").Router()
const auth = require('../utils/verifyAuth')




router.post("/addCourse", auth, async(req, res, next) => {
    if (req.userData.route != 'lecturer') return res.json({ status: false, message: "unauthorized" })
    courses.getCourse(req.body, (err, courseData) => {
        if (err) throw err;
        if (courseData) return res.json({ status: false, message: "Course already in database" });
        req.body.dir = '/' + req.body.code
        courses.insertCourse(req.body, (err, course) => {
            if (err) return res.json({ message: err })
            res.json(course);
        })
    })
})

router.get("/:code", auth, async(req, res, next) => {
    const query = { code: req.params.code }
    courses.getCourse(query, (err, course) => {
        if (err) throw err;
        if (!course) return res.json({ status: false, message: "course not found" })
        res.json({ status: true, course })
    })
})

module.exports = router