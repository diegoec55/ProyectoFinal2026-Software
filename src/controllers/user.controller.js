// importamos desde el index de modelos
const { User, Illness } = require('../models')
const { sequelize } = require('../config/database')

// obtener usuario
exports.getUser = async (req, res) => {

    try {
        const user = await User.findByPk(req.params.id, {
            // Ocultamos la contraseña por seguridad
            attributes: { exclude: ['password'] }, 
            // Traemos los datos basicos de su cuidador asociado
            include: [
            {
                model: User,
                as: 'carer',
                attributes: ['id', 'name', 'lastName', 'email'] 
            },

            {
                model: Illness,
                as: 'illnesses',
                attributes: ['id', 'name', 'description'],
                    through: {
                    attributes: ['notes']
                }
            }
        ]
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
        user.name = req.body.name ?? user.name
        user.lastName = req.body.lastName ?? user.lastName
        user.email = req.body.email ?? user.email
        user.role = req.body.role ?? user.role
        user.dni = req.body.dni ?? user.dni
        user.birthDate = req.body.birthDate ?? user.birthDate
        user.carerId = req.body.carerId !== undefined ? req.body.carerId : user.carerId
        user.phone = req.body.phone ?? user.phone

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
            attributes: { exclude: ['password'] }, // Seguridad basica
            include: [
                {
                    model: User,
                    as: 'carer',
                    attributes: ['id', 'name', 'lastName', 'email']
                },
                {
                    model: Illness,
                    as: 'illnesses',
                    attributes: ['id', 'name', 'description'],
                    through: {
                        attributes: ['notes']
                    }
                }
            ],
            order: [ //admin ve antes las cuentas en uso sin dejar de tener acceso a las desactivadas
                ['role', 'ASC'],
                ['lastName', 'ASC'],
                ['name', 'ASC']
            ]
        })

        res.json(users)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error del servidor al listar usuarios' })
    }
}

// cambiar contraseña
exports.changePassword = async (req, res) => {

    try {

        const { currentPassword, newPassword } = req.body

        const user = await User.findByPk(req.params.id)

        if (!user) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            })
        }

        // Verificar contraseña actual
        const validPassword = await user.validPassword(currentPassword)

        if (!validPassword) {
            return res.status(400).json({
                message: 'La contraseña actual es incorrecta'
            })
        }

        // Validar longitud minima
        // if (newPassword.length < 8) {
        //     return res.status(400).json({
        //         message: 'La nueva contraseña debe tener al menos 8 caracteres'
        //     })
        // }

        // Guardar nueva contraseña
        user.password = newPassword

        await user.save()

        res.json({
            message: 'Contraseña actualizada correctamente'
        })

    } catch (error) {

        console.error(error)

        res.status(500).json({
            message: 'Error del servidor'
        })

    }

}

// Baja logica del usuario
exports.deleteUser = async (req, res) => {

    const transaction = await sequelize.transaction()

    try {
        const user = await User.findByPk(req.params.id, { transaction })

        if (!user) {
            await transaction.rollback()
            return res.status(404).json({
                message: 'Usuario no encontrado'
            })
        }

        // Si es paciente, desvincular al cuidador
        if (user.role === 'user') {
            const carer = await User.findOne({
                where: { id: user.carerId },
                transaction
            })

            if (carer) {
                user.carerId = null
                await user.save({ transaction })
            }
        }

        // Si es cuidador, desvincular todos sus pacientes
        if (user.role === 'carer') {
            await User.update(
                { carerId: null },
                {
                    where: { carerId: user.id },
                    transaction
                }
            )
        }

        // Anonimizar información personal
        user.name = `Usuario #${user.id}`
        user.lastName = 'Eliminado'
        user.email = `deleted_${user.id}@deleted.local`
        user.password = 'usuario_eliminado'
        user.dni = null
        user.phone = null
        user.isActive = false
        user.deletedAt = new Date()

        await user.save({ transaction })
        await transaction.commit()

        res.json({
            message: 'Cuenta eliminada correctamente'
        })

    } catch (error) {
        await transaction.rollback()
        console.error(error)
        res.status(500).json({
            message: 'Error del servidor'
        })
    }
}