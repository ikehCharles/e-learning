const mongoose = require("mongoose")

const lecturerSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        title: {
            type: String,
            required: true
        },
        first: {
            type: String,
            required: true
        },
        last: {
            required: true,
            type: String
        }
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    courseId: {
        type: String,
        required: false
    },
    department: {
        type: String,
        required: false
    },
    faculty: {
        type: String,
        required: false
    }
})


const lecturers = module.exports = mongoose.model('lecturers', lecturerSchema)

module.exports.getLecturers = async(callback) => {
    // let pupil = { matricNumber: studentData.matricNumber }
    lecturers.find(callback)
}
module.exports.getLecturer = async(lecturerData, callback) => {
    let lecturer = { email: lecturerData.email }
    lecturers.findOne(lecturer, callback)
}
module.exports.insertlecturer = async(lecturer, callback) => {
    const newLecturer = new lecturers(lecturer);
    newLecturer.save(callback)
}
module.exports.getLecturerById = async(lecturer, callback) => {
    const id = { id: lecturer.id }
    lecturers.findById(id, callback)
}
module.exports.updateLecturerCourse = async(lecturerCredential, callback) => {
    const query = { _id: lecturerCredential.getLecturerById };
    const updateValue = { courseId: lecturerCredential.courseId }
    lecturers.updateOne(query, updateValue, callback)
}