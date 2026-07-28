const { HealthRecord, Device } = require('../models')

exports.createRecord = async (req, res) => {
    console.log(req.body)//////////////////////////////////////////////////prueba de error
    try {
        const {
            device_serial,
            heart_rate,
            blood_oxygen,
            temperature,
            fall_detected,
            acc_x,
            acc_y,
            acc_z,
            acc_magnitude
        } = req.body

        // ============================================1
        // Buscar el dispositivo por número de serie

        const device = await Device.findOne({
            where: {
                serial_number: device_serial
            }
        });

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Dispositivo no registrado"
            });
        }
        // ============================================2

        // ============================================1
        // Verificar que tenga un paciente asignado

        if (!device.user_id) {
            return res.status(400).json({
                success: false,
                message: "El dispositivo no tiene un paciente asignado"
            });
        }
        // ============================================2

        // ============================================1
        // Actualizar última conexión

        device.last_connection = new Date();
        await device.save();
        // ============================================2

        // Crear registro de salud
        const record = await HealthRecord.create({
            user_id: device.user_id,
            heart_rate,
            blood_oxygen,
            temperature,
            fall_detected,
            acc_x,
            acc_y,
            acc_z,
            acc_magnitude
        });

        console.log("REGISTRO GUARDADO");
        console.log(record.toJSON());

        res.status(201).json({
            success: true,
            record
        })

    } catch (error) {

        console.error(error)

        res.status(500).json({
            success: false,
            message: 'Error al guardar medición'
        })
    }
}

// Ahora filtra por el usuario recibido como parametro de ruta
exports.getRecords = async (req, res) => {
    try {
        const { userId } = req.params // Captura el ID desde la URL

        // Buscamos solo los registros que pertenezcan a este usuario específico
        const records = await HealthRecord.findAll({
            where: { user_id: userId },
            order: [['createdAt', 'DESC']]
        })

        res.json(records)

    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Error al obtener registros'
        })
    }
}