const express = require('express')
const router = express.Router()

const healthController =
    require('../controllers/health.controller')

router.post('/data', healthController.createRecord)

module.exports = router