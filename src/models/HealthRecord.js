const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')
const User = require('./User')

const HealthRecord = sequelize.define('HealthRecord', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        },
        onDelete: 'CASCADE'
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

// Relaciones
User.hasMany(HealthRecord, { foreignKey: 'userId' })
HealthRecord.belongsTo(User, { foreignKey: 'userId' })

module.exports = HealthRecord