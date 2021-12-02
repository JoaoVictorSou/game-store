const express = require('express')

//MODEL IMPORTS
const Game = require('./Game')

//MIDDLEWARE IMPORTS
const restriction = require('../middleware/restriction')

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

router.post('/game', restriction, (req, res) => {
    const title = req.body.title
    const year = parseInt(req.body.year)
    const price = parseFloat(req.body.price).toFixed(2)
    const userId = req.body.userId

    if (title && year && price && userId) {
        Game
            .create({
                title,
                year,
                price,
                userId
            })
            .then(_ => {
                res.sendStatus(201)
            })
            .catch(_ => {
                console.log(`[ERR] CREATE GAME AT TABLE: ${err}`)
                res.sendStatus(500)
            })
    } else {
        res.send(400)
    }
})

router.delete('/game/:id', restriction, (req, res) => {
    const id = parseInt(req.params.id)

    if (!isNaN(id)) {
        Game
            .findByPk(id)
            .then(game => {
                if (game) {
                    Game.destroy({
                        where: {
                            id: id
                        }
                    })
                    .then(_ => {
                        res.sendStatus(200)
                    })
                    .catch(err => {
                        console.log(`[ERR] DESTROY GAME: ${err}`)
                        res.sendStatus(500)
                    })
                } else {
                    res.sendStatus(404)
                }
            })
            .catch(err => {
                console.log(`[ERR] FIND ONE GAME TO DELETE: ${err}`)
                res.sendStatus(500)
            })
    } else {
        res.sendStatus(400)
    }
})

router.put('/game/:id', restriction, (req, res) => {
    const id = parseInt(req.params.id)
    const title = req.body.title
    const year = req.body.year
    const price = req.body.price
    const userId = req.body.userId

    if (!isNaN(id)) {
        if (title || year || price || userId) {
            Game.findByPk(id)
                .then(game => {
                    if (game) {
                        if (title) {
                            Game.update({
                                title,
                            }, {
                                where: {
                                id: id
                            }})
                            .catch(err => {
                                console.log(`[ERR] UPDATE GAME (title): ${err}`)
                                res.sendStatus(500)
                            })
                        }
                        if (year) {
                            Game.update({
                                year,
                            }, {
                                where: {
                                id: id
                            }})
                            .catch(err => {
                                console.log(`[ERR] UPDATE GAME (year): ${err}`)
                                res.sendStatus(500)
                            })
                        }
                        if (price) {
                            Game.update({
                                price,
                            }, {
                                where: {
                                id: id
                            }})
                            .catch(err => {
                                console.log(`[ERR] UPDATE GAME (price): ${err}`)
                                res.sendStatus(500)
                            })
                        }

                        if (userId) {
                            Game.update({
                                userId,
                            }, {
                                where: {
                                id: id
                            }})
                            .catch(err => {
                                console.log(`[ERR] UPDATE GAME (userId): ${err}`)
                                res.sendStatus(500)
                            })
                        }

                        res.sendStatus(200)
                    } else {
                        res.sendStatus(404)
                    }
                })
                .catch(err => {
                    console.log(`[ERR] FIND ONE GAME TO UPDATE: ${err}`)
                    res.sendStatus(500)
                })
        } else {
            res.sendStatus(400)
        }
    } else {
        res.sendStatus(400)
    }
})

module.exports = router