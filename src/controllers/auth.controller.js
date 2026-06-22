// IMPORTANTE: Importamos desde el index de modelos para tener las relaciones activas
const { User } = require('../models/index')

exports.register = async (req, res) => {
    // Agregamos todos los campos al req.body
    const { name, lastName, dni, birthDate, email, password, role, illnesses } = req.body

    try {
        // Validación básica
        if (!name || !lastName || !dni || !birthDate || !email || !password) {
            return res.status(400).json({
                message: 'Nombre, apellido, DNI, fecha de nacimiento, email y contraseña son requeridos'
            })
        }

        // Verificar si el email o el DNI ya existen (ambos deben ser únicos)
        const existe = await User.findOne({
            where: {
                [require('sequelize').Op.or]: [{ email }, { dni }]
            }
        })

        if (existe) {
            return res.status(400).json({
                message: 'El email o el DNI ya se encuentran registrados'
            })
        }

        // crear usuario (bcrypt hashea automáticamente gracias al hook)
        const newUser = await User.create({
            name,
            lastName,
            dni,
            birthDate,
            email,
            password,
            role: role || 'user', // por defecto es 'user'
            illnesses: illnesses || null
        })

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            user: {
                id: newUser.id,
                name: newUser.name,
                lastName: newUser.lastName,
                email: newUser.email,
                role: newUser.role
            }
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Error del servidor'})
    }
}


exports.login = async (req, res) => {
    const { email, password } = req.body

    try {
        // Validación básica
        if (!email || !password) {
            return res.status(400).json({message: 'Email y contraseña son requeridos'})
        }

        const user = await User.findOne({where: { email }})

        if (!user) {
            return res.status(404).json({message: 'Usuario no encontrado'})
        }

        // Comparar contraseña usando bcrypt
        const passwordValida = await user.validPassword(password)

        if (!passwordValida) {
            return res.status(401).json({message: 'Contraseña incorrecta'})
        }

        res.status(200).json({
            message: 'Login exitoso',
            user: {
                id: user.id,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                role: user.role // devolver el rol para manejar accesos en el frontend
            }
        })
        
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Error del servidor'})
    }
}