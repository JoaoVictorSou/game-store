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
                res.sendStatus(404)
            }
        })
        .catch(err => {
            console.log(`[ERR] FIND ALL GAMES: ${err}`)
            res.sendStatus(500)
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
                    res.sendStatus(404)
                }
            })
            .catch(err => {
                console.log(`[ERR] FIND ESPECIFIC GAME: ${err}`)
                res.sendStatus(500)
            })
    } else {
        res.sendStatus(400)
    }

})

router.post('/game', (req, res) => {
    const title = req.body.title
    const year = parseInt(req.body.year)
    const price = parseFloat(req.body.price).toFixed(2)

    if (title && year && price) {
        Game
            .create({
                title,
                year,
                price
            })
            .then(_ => {
                res.sendStatus(201)
            })
            .catch(_ => {
                console.log(`[ERR] CREATE GAME AT TABLE: ${err}`)
                res.sendStatus(500)
            })
    } else {
        res.statusCode = 400
        res.send(400)
    }
})

module.exports = router