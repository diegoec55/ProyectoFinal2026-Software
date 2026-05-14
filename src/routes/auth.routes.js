const express = require('express')
const router = express.Router()
const controller = require('../controllers/auth.controller')

//login
router.post('/login', controller.login) //probando primera ruta al login

//register
router.post('/register', controller.register)

module.exports = router