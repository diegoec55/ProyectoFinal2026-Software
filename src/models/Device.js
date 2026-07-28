const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
            type: DataTypes.ENUM('active', 'inactive'),
            allowNull: false,
            defaultValue: 'active'
        },

        last_connection: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        tableName: 'devices',
        underscored: true,
        timestamps: true
    }
);

module.exports = Device;