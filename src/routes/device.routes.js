const express = require('express');
const router = express.Router();

const deviceController = require('../controllers/device.controller');

// OBTENER TODOS LOS DISPOSITIVOS
// GET /api/devices
router.get('/', deviceController.getDevices);

// OBTENER UN DISPOSITIVO POR ID
// GET /api/devices/:id
router.get('/:id', deviceController.getDevice);

// CREAR DISPOSITIVO
// POST /api/devices
router.post('/', deviceController.createDevice);

// ACTUALIZAR DISPOSITIVO
// PUT /api/devices/:id
router.put('/:id', deviceController.updateDevice);

// ELIMINAR DISPOSITIVO
// DELETE /api/devices/:id
router.delete('/:id', deviceController.deleteDevice);

module.exports = router;