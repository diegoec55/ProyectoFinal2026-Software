const express = require('express')
const router = express.Router()
const controller = require('../controllers/user.controller')

// obtener usuario
router.get('/:id', controller.getUser)

// actualizar usuario
router.put('/:id', controller.updateUser)

module.exports = router