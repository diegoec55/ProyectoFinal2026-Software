const { DataTypes } = require('sequelize') //definimos los tipos de datos
const bcrypt = require('bcrypt')
const { sequelize } = require('../config/database')

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true,

    hooks: {
        beforeCreate: async (user) => {
            user.password = await bcrypt.hash(user.password, 10)
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                user.password = await bcrypt.hash(user.password, 10)
            }
        }
    }
})

// Método para comparar contraseñas
User.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password)
}

module.exports = User