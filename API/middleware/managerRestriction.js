const jwt = require('jsonwebtoken')
const jwtSecret = require('../database/jwtSecret')

async function managerRestriction(req, res, next) {
    const bearer = req.headers['authorization']

    if (bearer) {
        let token = bearer.split(' ')[1]
        jwt.verify(token, jwtSecret, (err, data) => {
                if (!err) {
                    if (data.level < 2) {
                        req.user = data
                        next()
                    } else {
                        res.sendStatus(403)
                    }
                } else {
                    res.sendStatus(401)
                }
            })
    }
}

module.exports = managerRestriction