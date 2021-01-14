const mongoose = require("mongoose")

const studentSchema = mongoose.Schema({
    matricNumber: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    },
    department: {
        type: String,
        required: true
    },
    faculty: {
        type: String,
        required: true
    }
})


const students = module.exports = mongoose.model('students', studentSchema);

module.exports.getStudents = async(callback) => {
    // let pupil = { matricNumber: studentData.matricNumber }
    students.find(callback)
}
module.exports.getStudent = async(studentData, callback) => {
    let pupil = { matricNumber: studentData.matricNumber }
    students.findOne(pupil, callback)
}
module.exports.insertStudent = async(studentData, callback) => {
    const newStudent = new students(studentData);
    newStudent.save(callback)
}