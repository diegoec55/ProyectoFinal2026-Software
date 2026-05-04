const express = require('express')
const router = express.Router()
const controller = require('../controllers/auth.controller')

router.post('/login', controller.login) //probando primera ruta al login

module.exports = router