const jwt = require('jsonwebtoken')
const jwtSecret = require('../database/jwtSecret')

async function clientRestriction(req, res, next) {
    const bearer = req.headers['authorization']

    if (bearer) {
        let token = bearer.split(' ')[1]
        jwt.verify(token, jwtSecret, (err, data) => {
                if (!err) {
                    req.user = data
                    next()
                } else {
                    res.sendStatus(401)
                }
            })
    }
}

module.exports = clientRestriction