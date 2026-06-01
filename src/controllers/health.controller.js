const { HealthRecord } = require('../models')

exports.createRecord = async (req, res) => {
    console.log(req.body)//////////////////////////////////////////////////prueba de error
    try {

        const {
            user_id,
            heart_rate,
            blood_oxygen,
            temperature,
            fall_detected
        } = req.body

        const record = await HealthRecord.create({
            user_id,
            heart_rate,
            blood_oxygen,
            temperature,
            fall_detected
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