const DataTypes = require('sequelize')
const connection = require('../database/connection')

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
    }
})

User.sync({force: false})
    .then(_ => {
        console.log(`[SUC] CREATE USER TABLE`)
    })
    .catch(err => {
        console.log(`[ERR] CREATE USER TABLE: ${err}`)
    })

module.exports = User