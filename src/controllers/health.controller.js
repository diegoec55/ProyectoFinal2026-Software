const { HealthRecord } = require('../models')

exports.createRecord = async (req, res) => {
    try {

        const {
            heartRate
        } = req.body

        const record = await HealthRecord.create({
            user_id: 1,            // temporal para pruebas
            heart_rate: heartRate,
            blood_oxygen: 98,      // valor fijo por ahora
            temperature: 36.5,     // valor fijo por ahora
            fall_detected: false
        })

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