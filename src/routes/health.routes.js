const express = require('express')
const router = express.Router()
const healthController = require('../controllers/health.controller')

// Endpoint para que el ESP32 o Postman sigan guardando datos
router.post('/data', healthController.createRecord)

// ENDPOINT MODIFICADO: Coincide con la peticion del frontend
router.get('/user/:userId', healthController.getRecords)

// ENDPOINT PARA LAS ALERTAS DE CAIDAS
router.get('/alerts/falls', healthController.getFallAlerts)

module.exports = router