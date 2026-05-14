const User = require('../models/User')

exports.register = async (req, res) => {
    const { email, password } = req.body

    try {

        // verificar si ya existe
        const existe = await User.findOne({
            where: { email }
        })

        if (existe) {
            return res.status(400).json({
                message: 'El usuario ya existe'
            })
        }

        // crear usuario
        const newUser = await User.create({
            email,
            password
        })

        res.status(201).json({
            message: 'Usuario creado',
            user: {
                id: newUser.id,
                email: newUser.email
            }
        })

    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: 'Error del servidor'
        })
    }
}


exports.login = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ 
            where: { email } 
        })

        if (!user) {
            return res.status(404).json({ 
                message: 'Usuario no encontrado' 
            })
        }

        // comparacion simple (DESPUES REPASAR COMO USAR BCRYPT)
        if (user.password !== password) {
            return res.status(401).json({ 
                message: 'Contraseña incorrecta' 
            })
        }

        res.json({
            message: 'Login exitoso',
            user: {
                id: user.id,
                email: user.email
            }
        })

    } catch (error) {
        console.error(error)

        res.status(500).json({ 
            message: 'Error del servidor' 
        })
    }
}