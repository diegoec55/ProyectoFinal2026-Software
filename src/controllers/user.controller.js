const User = require('../models/User')

// obtener usuario
exports.getUser = async (req, res) => {

    try {
        const user = await User.findByPk(req.params.id)

        if (!user) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            })
        }
        res.json(user)

    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Error del servidor'
        })
    }
}

// actualizar usuario
exports.updateUser = async (req, res) => {

    try {
        const user = await User.findByPk(req.params.id)

        if (!user) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            })
        }
        user.name = req.body.name

        await user.save()

        res.json({
            message: 'Usuario actualizado',
            user
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Error del servidor'
        })
    }
}