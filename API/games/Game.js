const DataTypes = require('sequelize')
const connection = require('../database/connection')

const Game = connection.define('games', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false
    }
})

module.exports = Game