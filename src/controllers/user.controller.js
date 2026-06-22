// importamos desde el index de modelos
const { User } = require('../models/index') 

// obtener usuario
exports.getUser = async (req, res) => {

    try {
        const user = await User.findByPk(req.params.id, {
            // Ocultamos la contraseña por seguridad
            attributes: { exclude: ['password'] }, 
            // Traemos los datos basicos de su cuidador asociado
            include: {
                model: User,
                as: 'assignedCarer',
                attributes: ['id', 'name', 'lastName', 'email'] 
            }
        })

        if (!user) {
            return res.status(404).json({message: 'Usuario no encontrado'})
        }
        res.json(user)

    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Error del servidor'})
    }
}

// actualizar usuario
exports.updateUser = async (req, res) => {

    try {
        const user = await User.findByPk(req.params.id)

        if (!user) {
            return res.status(404).json({message: 'Usuario no encontrado'})
        }
        // Permitimos actualizar los campos personales, enfermedades y el cuidador asignado
        user.name = req.body.name || user.name
        user.lastName = req.body.lastName || user.lastName
        user.dni = req.body.dni || user.dni
        user.birthDate = req.body.birthDate || user.birthDate
        user.illnesses = req.body.illnesses !== undefined ? req.body.illnesses : user.illnesses
        user.carerId = req.body.carerId !== undefined ? req.body.carerId : user.carerId

        await user.save()

        // Ocultamos la contraseña antes de responder
        user.password = undefined

        res.json({
            message: 'Usuario actualizado',
            user
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Error del servidor'})
    }
}

// Obtener todos los usuarios del sistema (util para el panel de administracion)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] } // Seguridad basica
        })
        res.json(users)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error del servidor al listar usuarios' })
    }
}