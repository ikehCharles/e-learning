const jwt = require('jsonwebtoken')
const path = require('path')
const fs = require('fs')
require('dotenv').config()


const pathToKey = path.join(__dirname, process.env.pathToKeys, 'id_rsa_pub.pem')
const PUB_KEY = fs.readFileSync(pathToKey, 'utf-8')

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, PUB_KEY);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(200).json({ message: 'Auth failed', valid: 0 });
    }
}