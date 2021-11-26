const express = require('express')
const bodyParser = require('body-parser')

//SERVER SETTINGS
const app = express()
app.use(bodyParser.urlencoded( {extended: false} ))
app.use(bodyParser.json())

//SERVER INIT
app.listen(8080, _ => {
    console.log('API INIT')
})