// IMPORTANTE: Importamos desde el index de modelos para tener las relaciones activas
const { User, UserIllness } = require('../models')
const { sequelize } = require('../config/database')

exports.register = async (req, res) => {
    // Agregamos todos los campos al req.body
    const { name, lastName, dni, birthDate, email, password, role, selectedIllnesses, phone, patientDni } = req.body

    const transaction = await sequelize.transaction()

    try {
        // Validación básica
        if (!name || !lastName || !email || !password) {
            await transaction.rollback()
            return res.status(400).json({
                message: 'Nombre, apellido, email y contraseña son requeridos'
            })
        }

        // Los pacientes necesitan estos datos
        if ((role || 'user') === 'user') {
            if (!dni || !birthDate) {
                await transaction.rollback()
                return res.status(400).json({
                    message: 'El paciente debe ingresar DNI y fecha de nacimiento.'
                })
            }
        }

        // Los cuidadores necesitan telefono y DNI del paciente
        if (role === 'carer') {
            if (!phone || !patientDni) {
                await transaction.rollback()
                return res.status(400).json({
                    message: 'El cuidador debe ingresar teléfono y DNI del paciente.'
                })
            }
        }

        // Verificar si el email existe (debe ser unico)
        const emailExists = await User.findOne({
            where: { email },
            transaction
        })

        if (emailExists) {
            await transaction.rollback()
            return res.status(400).json({
                message: 'El email ya se encuentra registrado.'
            })
        }

        // Registro de PACIENTE
        if ((role || 'user') === 'user') {

            const dniExists = await User.findOne({
                where: { dni },
                transaction
            })

            if (dniExists) {
                await transaction.rollback()
                return res.status(400).json({
                    message: 'El DNI ya se encuentra registrado.'
                })
            }

        const newUser = await User.create({
            name,
            lastName,
            dni,
            birthDate,
            email,
            password,
            role: 'user', // por defecto es 'user'
        }, { transaction })

        // Guardar enfermedades seleccionadas
        if (selectedIllnesses && selectedIllnesses.length > 0) {
            const illnessesToSave = selectedIllnesses.map(item => ({
                user_id: newUser.id,
                illness_id: item.illnessId,
                notes: item.notes || ''
            }))
            await UserIllness.bulkCreate(
                illnessesToSave,
                { transaction }
            )
        }

        await transaction.commit()

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

    }
    // Registro de CUIDADOR
        const patient = await User.findOne({
            where: {
                dni: patientDni,
                role: 'user'
            },
            transaction
        })

        if (!patient) {
            await transaction.rollback()
            return res.status(400).json({
                message: 'No existe un paciente con ese DNI.'
            })
        }

        if (patient.carerId) {
            await transaction.rollback()
            return res.status(400).json({
                message: 'Ese paciente ya tiene un cuidador asignado.'
            })

        }

        const newCarer = await User.create({
            name,
            lastName,
            // Los cuidadores no necesitan estos datos
            dni: null,
            birthDate: null,
            email,
            password,
            role: 'carer',
            phone,
        }, { transaction })

        patient.carerId = newCarer.id

        await patient.save({ transaction })

        await transaction.commit()

        return res.status(201).json({

            message: 'Cuidador registrado correctamente.',
            user: {
                id: newCarer.id,
                name: newCarer.name,
                lastName: newCarer.lastName,
                email: newCarer.email,
                role: newCarer.role
            }

        })

    } catch (error) {
        await transaction.rollback()
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
            return res.status(400).json({message: 'Email y contraseña son requeridos'})
        }

        const user = await User.findOne({where: { email }})

        if (!user.isActive) {
            return res.status(403).json({
            message: 'Esta cuenta fue dada de baja.'
            })
        }

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