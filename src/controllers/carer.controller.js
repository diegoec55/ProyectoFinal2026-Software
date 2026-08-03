const { User } = require('../models/index')

// Listar todos los cuidadores del sistema (para que el Admin elija uno)
exports.getAllCarers = async (req, res) => {
    try {
        const carers = await User.findAll({
            where: { role: 'carer' },
            attributes: ['id', 'name', 'lastName', 'email']
        })
        res.json(carers)
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: 'Error del servidor' })
    }
}

// Ver los pacientes que tiene asignados un cuidador específico
exports.getAssignedPatients = async (req, res) => {
    try {
        const carer = await User.findByPk(req.params.id, {
            attributes: ['id', 'name', 'lastName', 'role'],
            include: {
                model: User,
                as: 'patients',
                attributes: ['id', 'name', 'lastName']
            }
        })

        if (!carer || carer.role !== 'carer') {
            return res.status(404).json({ success: false,message: 'Cuidador no encontrado' })
        }

        res.json(carer.patients)
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: 'Error del servidor' })
    }
}