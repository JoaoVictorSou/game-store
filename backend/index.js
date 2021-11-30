const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const connection = require('./database/connection')

//MODEL IMPORTS
const Game = require('./games/Game')
const User = require('./users/User')

//CONTROLLER IMPORTS
const gamesController = require('./games/GamesController')
const usersController = require('./users/UsersController')

//SERVER SETTINGS
const app = express()
const JWTSecret = '552210'
app.use(cors())
app.use(bodyParser.urlencoded( {extended: false} ))
app.use(bodyParser.json())

//DATABASE SETTINGS
connection
    .authenticate()
    .then(_ => {
        console.log(`[SUC] DATABASE AUTHENTICATE`)
    })
    .catch(err => {
        console.log(`[ERR] DATABASE AUTHENTICATE: ${err}`)
    })

//ROUTES
app.post("/auth", (req, res) => {
    const {email, password} = req.body

    if(email && password) {
        User
            .findOne({
                where: {
                    email: email
                }
            })
            .then(user => {
                if (user) {
                    let hash = user.password
                    let isCorrect = bcrypt.compareSync(password, hash)

                    if (isCorrect) {
                        jwt.sign({
                            name: user.name,
                            email: user.email,
                            id: user.id
                        }, JWTSecret,
                        {
                            expiresIn: '1h'
                        }, (err, token) => {
                            if (err) {
                                console.log(`[ERR] USER AUTHENTICATE: ${err}`)
                                res.sendStatus(500)
                            } else {
                                res.status(200)
                                res.json({ token })
                            }
                        })
                    } else {
                        res.sendStatus(401)
                    }
                } else {
                    res.sendStatus(404)
                }
            })
    } else {
        res.sendStatus(400)
    }
})

//DOMANIS ROUTES
app.use('/', gamesController)
app.use('/', usersController)

//SERVER INIT
app.listen(8080, _ => {
    console.log('API INIT')
})