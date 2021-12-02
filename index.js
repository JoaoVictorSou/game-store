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

    User.sync({force: false})
    .then(_ => {
        console.log(`[SUC] CREATE USER TABLE`)
    })
    .catch(err => {
        console.log(`[ERR] CREATE USER TABLE: ${err}`)
    })
    
    Game
    .sync( {force: false} )
    .then(_ => {
        console.log(`[SUC] CREATE GAME TABLE`)
    })
    .catch(err => {
        console.log(`[ERR] CREATE GAME TABLE: ${err}`)
    })

//ROUTES

//DOMANIS ROUTES
app.use('/', gamesController)
app.use('/', usersController)

//SERVER INIT
app.listen(8080, _ => {
    console.log('API INIT')
})