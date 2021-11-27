const express = require('express')
const Game = require('./Game')

const router = express.Router()

router.get('/games', (req, res) => {
    Game
        .findAll()
        .then(games => {
            if (games.length) {
                res.statusCode = 200
                res.json(games)
            } else {
                res.statusCode = 404
                res.send('[ERR] Not found: 404')
            }
        })
        .catch(err => {
            console.log(`[ERR] FIND ALL GAMES: ${err}`)
            res.statusCode = 500
            res.send(`[ERR] SERVER ERROR: 500`)
        })

})

router.get('/game/:id', (req, res) => {
    const id = parseInt(req.params.id)
    
    if(!isNaN(id)) {
        Game
            .findByPk(id)
            .then(game => {
                if (game) {
                    res.statusCode = 200
                    res.json(game)
                } else {
                    res.statusCode = 404
                    res.send(404)
                }
            })
            .catch(err => {
                console.log(`[ERR] FIND ESPECIFIC GAME: ${err}`)
                res.statusCode = 500
                res.send(500)
            })
    } else {
        res.statusCode = 400
        res.send(400)
    }

})

router.post('/game', (req, res) => {
    const title = req.body.title
    const year = parseInt(req.body.year)
    const price = parseFloat(req.body.price).toFixed(2)

    Game
        .create({
            title,
            year,
            price
        })
        .then(_ => {
            res.statusCode = 201
            res.send(`[SUC] CREATE GAME AT TABLE: 201`)
        })
        .catch(_ => {
            console.log(`[ERR] CREATE GAME AT TABLE: ${err}`)
            res.statusCode = 500
            res.send(`[ERR] CREATE GAME AT TABLE: 500`)
        })
})

module.exports = router