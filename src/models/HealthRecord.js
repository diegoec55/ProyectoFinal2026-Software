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
    }

}, {
    timestamps: true
})

// IMPORTANTE (relaciones)
const User = require('./User')

HealthRecord.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
})

module.exports = HealthRecord