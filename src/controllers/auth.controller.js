const User = require('../models/User')

exports.login = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ where: { email } })

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' })
        }

        if (user.password !== password) {
            return res.status(401).json({ error: 'Contraseña incorrecta' })
        }

        res.json({ message: 'Login exitoso', user })

    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' })
    }
}