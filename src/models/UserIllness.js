const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const UserIllness = sequelize.define('UserIllness',{

    notes:{
        type:DataTypes.TEXT,
        allowNull:true
    }

})

module.exports = UserIllness