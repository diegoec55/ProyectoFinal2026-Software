const express = require('express')
const router = express.Router()
const controller = require('../controllers/user.controller')

// obtener usuario
router.get('/:id', controller.getUser)

// actualizar contraseña
router.put('/:id/password', controller.changePassword)

// baja logica
router.put('/:id/deactivate', controller.deleteUser)

// actualizar usuario
router.put('/:id', controller.updateUser)

module.exports = router