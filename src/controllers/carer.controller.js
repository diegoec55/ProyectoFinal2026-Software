const { User } = require('../models/index')

// Listar todos los cuidadores del sistema (para que el Admin elija uno)
exports.getAllCaregivers = async (req, res) => {
    try {
        const caregivers = await User.findAll({
            where: { role: 'cuidador' },
            attributes: ['id', 'name', 'lastName', 'email']
        })
        res.json(caregivers)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error del servidor' })
    }
}

// Ver los pacientes que tiene asignados un cuidador específico
exports.getAssignedPatients = async (req, res) => {
    try {
        const caregiver = await User.findByPk(req.params.id, {
            attributes: ['id', 'name', 'lastName'],
            include: {
                model: User,
                as: 'patients',
                attributes: ['id', 'name', 'lastName', 'illnesses']
            }
        })

        if (!caregiver || caregiver.role !== 'cuidador') {
            return res.status(404).json({ message: 'Cuidador no encontrado' })
        }

        res.json(caregiver.patients)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error del servidor' })
    }
}