const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const HealthRecord = sequelize.define('HealthRecord', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    device_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'devices',
            key: 'id'
        }
    },
    heart_rate: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    blood_oxygen: {
        type: DataTypes.INTEGER,
        allowNull: true
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