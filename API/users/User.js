const DataTypes = require('sequelize')
const connection = require('../database/connection')

const Game = require('../games/Game')

const User = connection.define('users', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    level: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

User.hasMany(Game)
Game.belongsTo(User)

module.exports = User