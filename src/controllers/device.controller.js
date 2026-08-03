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
            success: false,
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
                success: false,
                message: 'Dispositivo no encontrado'
            });
        }
        res.json(device);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
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
                success: false,
                message: 'El número de serie ya está registrado'
            });
        }

        // Si se envía un usuario, verificar que exista
        if (user_id) {

            const user = await User.findByPk(user_id);

            if (!user) {
                return res.status(404).json({
                    success: false,
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
            success: false,
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
                success: false,
                message: 'Dispositivo no encontrado'
            });
        }

        let existingDevice = null;

        if (req.body.serial_number) {
            existingDevice = await Device.findOne({
                where: {
                    serial_number: req.body.serial_number
                }
            });

            if (existingDevice && existingDevice.id !== device.id) {
                return res.status(400).json({
                    success: false,
                    message: 'El número de serie ya está registrado'
                });
            }
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
            success: false,
            message: 'Error al actualizar el dispositivo'
        });
    }
};

// ======================================================
// Asignar un dispositivo a un paciente
// ======================================================

exports.assignDevice = async (req, res) => {

    try {
        const device = await Device.findByPk(req.params.id);

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Dispositivo no encontrado"
            });
        }

        const user = await User.findByPk(req.body.user_id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Paciente no encontrado"
            });
        }

        if (device.user_id && device.user_id !== user.id) {
            return res.status(400).json({
                success: false,
                message: 'El dispositivo ya está asignado a otro paciente.'
            });
        }

        device.user_id = user.id;
        device.status = "active";

        await device.save();

        res.json({
            message: "Dispositivo asignado correctamente",
            device
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al asignar dispositivo"
        });
    }
};

// ======================================================
// Desasignar dispositivo
// ======================================================

exports.unassignDevice = async (req, res) => {

    try {
        const device = await Device.findByPk(req.params.id);

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Dispositivo no encontrado"
            });
        }

        device.user_id = null;
        device.status = "unassigned";

        await device.save();

        res.json({
            message: "Dispositivo desasignado"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al desasignar dispositivo"
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
                success: false,
                message: 'Dispositivo no encontrado'
            });
        }

        if (device.user_id) {
            return res.status(400).json({
                success: false,
                message: 'Primero desasigne el dispositivo del paciente.'
            })
        }

        await device.destroy();

        res.json({
            message: 'Dispositivo eliminado correctamente'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el dispositivo'
        });
    }
};