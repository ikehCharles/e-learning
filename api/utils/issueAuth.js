const jsonwebtoken = require('jsonwebtoken')
const fs = require('fs');
const path = require('path')
require('dotenv').config()



pathToKey = path.join(__dirname, process.env.pathToKeys, 'id_rsa_priv.pem')
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf-8')


function issueJwt(user, route) {
    const _id = user._id
    const expiresIn = '1d'

    const payload = {
        sub: _id,
        route: route,
        iat: Date.now()
    }
    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' })

    return {
        token: "Bearer " + signedToken,
        expires: expiresIn
    }
}

module.exports = issueJwt