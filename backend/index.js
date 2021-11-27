const express = require('express')
const bodyParser = require('body-parser')
const connection = require('./database/connection')

//MODEL IMPORTS
const Game = require('./games/Game')

//CONTROLLER IMPORTS
const gamesController = require('./games/GamesController')

//SERVER SETTINGS
const app = express()
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

//SERVER INIT
app.listen(8080, _ => {
    console.log('API INIT')
})