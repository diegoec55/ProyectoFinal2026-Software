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
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dni: {
        type: DataTypes.STRING(20), // STRING por si incluye puntos o guiones
        allowNull: false,
        unique: true
    },
    birthDate: {
        type: DataTypes.DATEONLY, // solo YYYY-MM-DD sin hora
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
    },
    role: {
        type: DataTypes.ENUM('admin', 'user', 'carer'),
        allowNull: false,
        defaultValue: 'user' // SOLO PARA PROBAR TODAS LAS OPCIONES NUEVAS, DESPUES CAMBIAR A SER!!!!!!
    },
    illnesses: {
        type: DataTypes.TEXT, // TEXT permite descripciones largas a diferencia de STRING
        allowNull: true       // Opcional, por si el usuario no tiene enfermedades
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