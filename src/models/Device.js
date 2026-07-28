const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Device = sequelize.define(
    'Device',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        serial_number: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        },

        name: {
            type: DataTypes.STRING(50),
            allowNull: true
        },

        status: {
            type: DataTypes.ENUM('active', 'inactive', 'unassigned'),
            allowNull: false,
            defaultValue: 'unassigned'
        },

        last_connection: {
            type: DataTypes.DATE,
            allowNull: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
            model: 'users',
            key: 'id'
            }
        },
    },
    {
        tableName: 'devices',
        underscored: true,
        timestamps: true
    }
);

module.exports = Device