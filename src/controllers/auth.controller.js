const User = require('../models/User')

exports.register = async (req, res) => {
    const { name, email, password } = req.body

    try {
        // Validación básica
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Nombre, email y contraseña son requeridos'
            })
        }

        // verificar si ya existe
        const existe = await User.findOne({
            where: { email }
        })

        if (existe) {
            return res.status(400).json({
                message: 'El usuario ya existe'
            })
        }

        // crear usuario (bcrypt hashea automáticamente gracias al hook)
        const newUser = await User.create({
            name,
            email,
            password
        })

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            user: {
                id: newUser.id,
                name: newUser.name,
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
        // Validación básica
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email y contraseña son requeridos'
            })
        }

        const user = await User.findOne({ 
            where: { email } 
        })

        if (!user) {
            return res.status(404).json({ 
                message: 'Usuario no encontrado' 
            })
        }

        // Comparar contraseña usando bcrypt
        const passwordValida = await user.validPassword(password)

        if (!passwordValida) {
            return res.status(401).json({
                message: 'Contraseña incorrecta'
            })
        }

        // Login exitoso
        res.status(200).json({
            message: 'Login exitoso',
            user: {
                id: user.id,
                name: user.name,
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