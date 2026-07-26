const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const UserIllness = sequelize.define('UserIllness',{

    notes:{
        type:DataTypes.TEXT,
        allowNull:true,
        defaultValue: ''
    }

    }, {
    tableName: 'user_illnesses'
})

module.exports = UserIllness