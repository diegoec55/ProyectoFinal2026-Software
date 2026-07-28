const { Device, User } = require('../models');

// ======================================================
// Obtener todos los dispositivos
// ======================================================

exports.getDevices = async (req, res) => {

    try {
        const devices = await Device.findAll({
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'lastName']
            }],
            order: [['id', 'ASC']]
        });
        res.json(devices);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al obtener los dispositivos'
        });
    }
};


// ======================================================
// Obtener un dispositivo por ID
// ======================================================

exports.getDevice = async (req, res) => {

    try {
        const device = await Device.findByPk(req.params.id, {
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'lastName']
            }]
        });
        if (!device) {
            return res.status(404).json({
                message: 'Dispositivo no encontrado'
            });
        }
        res.json(device);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al obtener el dispositivo'
        });
    }
};


// ======================================================
// Crear un nuevo dispositivo
// ======================================================

exports.createDevice = async (req, res) => {

    try {
        const {serial_number, name, user_id, status} = req.body;
        // Verificar que no exista otro dispositivo
        // con el mismo número de serie
        const existingDevice = await Device.findOne({
            where: { serial_number }
        });

        if (existingDevice) {
            return res.status(400).json({
                message: 'El número de serie ya está registrado'
            });
        }

        // Si se envía un usuario, verificar que exista
        if (user_id) {

            const user = await User.findByPk(user_id);

            if (!user) {
                return res.status(404).json({
                    message: "Paciente no encontrado"
                });
            }
        }

        const device = await Device.create({
            serial_number,
            name,
            user_id,
            status
        });

        res.status(201).json(device);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al crear el dispositivo'
        });
    }
};


// ======================================================
// Actualizar dispositivo
// ======================================================

exports.updateDevice = async (req, res) => {

    try {
        const device = await Device.findByPk(req.params.id);

        if (!device) {
            return res.status(404).json({
                message: 'Dispositivo no encontrado'
            });
        }

        device.serial_number = req.body.serial_number ?? device.serial_number;
        device.name = req.body.name ?? device.name;
        device.user_id = req.body.user_id ?? device.user_id;
        device.status = req.body.status ?? device.status;

        await device.save();

        res.json(device);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al actualizar el dispositivo'
        });
    }
};


// ======================================================
// Eliminar dispositivo
// ======================================================

exports.deleteDevice = async (req, res) => {

    try {
        const device = await Device.findByPk(req.params.id);

        if (!device) {
            return res.status(404).json({
                message: 'Dispositivo no encontrado'
            });
        }

        await device.destroy();

        res.json({
            message: 'Dispositivo eliminado correctamente'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al eliminar el dispositivo'
        });
    }
};