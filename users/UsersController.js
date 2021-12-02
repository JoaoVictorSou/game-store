const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwtSecret = require('../database/jwtSecret')

//MODEL IMPORTS
const User = require('./User')

//MIDDLEWARE IMPORTS
const managerRestriction = require('../middleware/managerRestriction')
const salesmanRestriction = require('../middleware/salesmanRestriction')

const router = express.Router()

router.get('/users', managerRestriction, (req, res) => {
    const HATEOAS = [
        {
            href: `http://localhost:8080/users`,
            method: 'GET',
            id: 'self'
        },
        {
            href: `http://localhost:8080/user`,
            method: 'POST',
            id: 'create_user'
        },
        {
            href: `http://localhost:8080/auth`,
            method: 'POST',
            id: 'auth'
        }
    ]
    
    User
        .findAll({
            attributes: [
                'id',
                'name',
                'email'
            ]
        })
        .then(users => {
            if (users.length) {
                res.statusCode = 200
                res.json({
                    users,
                    _links: HATEOAS
                })
            } else {
                res.sendStatus(404)
            }
        })
        .catch(err => {
            console.log(`[ERR] FIND ALL USERS: ${err}`)
            res.sendStatus(500)
        })
})

router.get('/user/:id', managerRestriction, (req, res) => {
    const id = parseInt(req.params.id)

    if (!isNaN(id)) {
        const HATEAOS = [
            {
                href: `http://localhost:8080/user/${id}`,
                method: 'GET',
                id: 'self'
            },
            {
                href: `http://localhost:8080/user/${id}`,
                method: 'PUT',
                id: 'edit_user'
            },
            {
                href: `http://localhost:8080/user/${id}`,
                method: 'DELETE',
                id: 'delete_user'
            },
            {
                href: `http://localhost:8080/user`,
                method: 'POST',
                id: 'create_user'
            },
            {
                href: `http://localhost:8080/users`,
                method: 'GET',
                id: 'get_users'
            },
            {
                href: `http://localhost:8080/auth`,
                method: 'POST',
                id: 'auth'
            }
        ]
        
        User
            .findByPk(id, {
                attributes: [
                    'id',
                    'name',
                    'email'
                ]
            })
            .then(user => {
                if (user) {
                    res.statusCode = 200
                    res.json({
                        user,
                        _links: HATEAOS
                    })
                } else {
                    res.sendStatus(404)
                }
            })
            .catch(err => {
                console.log('[ERR] FIND ESPECIFIC USER:', err)
                res.sendStatus(500)
            })
    } else {
        res.sendStatus(400)
    }
})

router.post('/user', (req, res) => {
    const {name, email, password} = req.body

    if (name, email, password) {
        User
            .findOne({
                where: {
                    email: email
                }
            })
            .then(user => {
                if (!user) {
                    let salt = bcrypt.genSaltSync(10)
                    let hash = bcrypt.hashSync(password, salt)

                    User
                        .create({
                            name: name,
                            email: email,
                            password: hash,
                            level: 3
                        })
                        .then(_ => {
                            res.sendStatus(201)
                        })
                        .catch(err => {
                            console.log('[ERR] DEFINE USER:', err)
                            res.sendStatus(500)
                        })
                } else {
                    res.sendStatus(422)
                }
            })
            .catch(err => {
                console.log(`[ERR] FIND USER TO DEFINE; ${err}`)
                res.sendStatus(500)
            })
    } else {
        res.sendStatus(400)
    }
})

router.put('/user/:id', managerRestriction, async (req, res) => {
    const id = parseInt(req.params.id)
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const level = req.body.level

    if (!isNaN(id)) {
        if (name || email || password || level) {
            try {
                let userById = await User.findByPk(id)
                
                if (userById) {
                    if (email) {
                        let emailExistence = await User.findOne({
                            where: {
                                email: email
                            }
                        })
    
                        if (!emailExistence) {
                            User.update({
                                email: email
                            }, {
                                where: {
                                    id: id
                                }
                            })
                        } else {
                            throw 'email_existence_Exception'
                        }
                    }
                    if (level) {
                        if (level > 1 && level < 4) {
                            User.update({
                                level
                            }, {
                                where: {
                                    id: id
                                }
                            })
                        } else {
                            throw 'level_Exception'
                        }
                    }
                    if (name) {
                        User.update({
                            name: name
                        }, {
                            where: {
                                id: id
                            }
                        })
                    }
                    if (password) {
                        let salt = bcrypt.genSaltSync(10)
                        let hash = bcrypt.hashSync(password, salt)
    
                        User.update({
                            password: hash
                        }, {
                            where: {
                                id: id
                            }
                        })
                    }
    
                    res.sendStatus(200)
                } else {
                    res.sendStatus(404)
                }
            } catch (err) {
                switch (err) {
                    case 'email_existence_Exception':
                        res.sendStatus(422)
                        break
                    case 'level_Exception':
                        res.sendStatus(400)
                        break
                    default:
                        console.log(`[ERR] USER UPDATE: ${err}`)
                        res.sendStatus(500)
                        break
                }
            }
        } else {
            res.sendStatus(400)
        }
    } else {
        res.sendStatus(400)
    }
})

router.delete("/user/:id", managerRestriction, (req, res) => {
    const id = parseInt(req.params.id)

    if (!isNaN(id)) {
        User
            .findByPk(id)
            .then(user => {
                if (user) {
                    User
                        .destroy({where: {
                            id: id
                        }})
                        .then(_ => {
                            res.sendStatus(200)
                        })
                        .catch(err => {
                            console.log(`[ERR] DELETE USER: ${err}`)
                            res.sendStatus(500)
                        })
                } else {
                    res.sendStatus(404)
                }
            })
    } else {
        res.sendStatus(400)
    }
})

router.post('/auth', (req, res) => {
    const {email, password} = req.body

    if (email && password) {
        User
            .findOne({
                where: {
                    email
                }
            })
            .then(user => {
                if (user) {
                    const isCorrect = bcrypt.compareSync(password, user.password)

                    if (isCorrect) {
                        jwt.sign({
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            level: user.level
                        },
                        jwtSecret,
                        {expiresIn: '2h'},
                        (err, token) => {
                            if (!err) {
                                res.json({ token })
                            } else {
                                console.log(`[ERR] USER AUTHENTICATE: ${err}`)
                            }
                        })
                    } else {
                        res.sendStatus(401)
                    }
                } else {
                    res.sendStatus(404)
                }
            })
            .catch(err => {
                console.log(`[ERR] FIND USER TO AUTHENTICATE`)
                res.sendStatus(500)
            })
    } else {
        res.sendStatus(400)
    }
})

module.exports = router