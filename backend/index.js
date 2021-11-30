const express = require('express')
const bodyParser = require('body-parser')
const connection = require('./database/connection')
const cors = require('cors')

//MODEL IMPORTS
const Game = require('./games/Game')
const User = require('./users/User')

//CONTROLLER IMPORTS
const gamesController = require('./games/GamesController')
const usersController = require('./users/UsersController')

//SERVER SETTINGS
const app = express()
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
app.use('/', gamesController)
app.use('/', usersController)

//SERVER INIT
app.listen(8080, _ => {
    console.log('API INIT')
})