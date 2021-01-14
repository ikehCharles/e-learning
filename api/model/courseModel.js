const mongoose = require("mongoose")

const courseSchema = mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    faculty: {
        type: String,
        required: true
    },
    dir: {
        type: String,
        required: true
    },
    lecturerId: {
        type: String,
        required: false
    }
})


const courses = module.exports = mongoose.model('courses', courseSchema)

module.exports.getFacultyCourses = async(courseCredential, callback) => {
    let facultyCourses = { faculty: courseCredential.faculty }
    courses.find(facultyCourses, callback)
}
module.exports.getDepartmentCourses = async(courseCredential, callback) => {
    let departmentCourses = { department: courseCredential.department }
    courses.find(departmentCourses, callback)
}
module.exports.getCourse = async(courseCredential, callback) => {
    let courseQuery = { code: courseCredential.code }
    courses.findOne(courseQuery, callback)
}
module.exports.insertCourse = async(courseCredential, callback) => {
    const newCourse = new courses(courseCredential);
    newCourse.save(callback)
}
module.exports.updateCourseLecturer = async(courseCredential, callback) => {
    const query = { code: courseCredential.code };
    const updateValue = { lecturerId: courseCredential.lecturerId }
    courses.updateOne(query, updateValue, callback)
}