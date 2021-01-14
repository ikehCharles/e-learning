const mongoose = require("mongoose")

const hodSchema = mongoose.Schema({
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
    department: {
        type: String,
        required: false
    },
    faculty: {
        type: String,
        required: false
    }
})


const hods = module.exports = mongoose.model('hods', hodSchema)

module.exports.getHods = async(callback) => {
    hods.find(callback)
}
module.exports.getHod = async(hodData, callback) => {
    let hod = { email: hodData.email }
    hods.findOne(hod, callback)
}
module.exports.getHodById = async(hodData, callback) => {
    let hod = { _id: hodData._id }
    hods.findById(hod, callback)
}
module.exports.insertHod = async(hodData, callback) => {
    const newHod = new hods(hodData);
    newHod.save(callback)
}