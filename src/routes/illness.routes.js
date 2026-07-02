const express = require('express')
const router = express.Router()
const controller = require('../controllers/illness.controller')

router.get('/', controller.getAllIllnesses)

module.exports = router