const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const Illness = sequelize.define('Illness',{

    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },

    name:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },

    description:{
        type:DataTypes.TEXT,
        allowNull:false
    }

})

module.exports = Illness