const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const HealthRecord = sequelize.define('HealthRecord', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    heart_rate: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    blood_oxygen: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    temperature: {
        type: DataTypes.FLOAT,
        allowNull: true
    },

    fall_detected: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }

}, {
    timestamps: true
})

module.exports = HealthRecord