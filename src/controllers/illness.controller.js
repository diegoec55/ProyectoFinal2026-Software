const { Illness } = require('../models')

exports.getAllIllnesses = async (req, res) => {

    try {
        const illnesses = await Illness.findAll({
            order: [['name', 'ASC']]
        })
        res.json(illnesses)

    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Error del servidor'})
    }

}