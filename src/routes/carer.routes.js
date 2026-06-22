const express = require('express')
const router = express.Router()
const carerController = require('../controllers/carer.controller')
// const { verifyToken } = require('../middlewares/jwt.middleware') // middleware de JWT
const { isAdmin, isCarerOrAdmin } = require('../middlewares/auth.middleware')

// 1. Listar todos los cuidadores (Solo accesible por el Administrador)
router.get('/', /* verifyToken, */ isAdmin, carerController.getAllCarers)

// 2. Ver los pacientes asignados a un cuidador específico (Accesible por Admin o el propio Carer)
router.get('/:id/patients', /* verifyToken, */ isCarerOrAdmin, carerController.getAssignedPatients)

module.exports = router
