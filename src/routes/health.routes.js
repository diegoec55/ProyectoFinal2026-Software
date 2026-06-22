const express = require('express')
const router = express.Router()
const healthController = require('../controllers/health.controller')

// Endpoint para que el ESP32 o Postman sigan guardando datos
router.post('/data', healthController.createRecord)

// ENDPOINT MODIFICADO: Coincide con la peticion del frontend
router.get('/health/user/:userId', healthController.getRecords)

module.exports = router