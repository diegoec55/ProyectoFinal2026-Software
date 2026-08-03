const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')

// Rutas
const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')
const healthRoutes = require('./routes/health.routes')
const carerRoutes = require('./routes/carer.routes')
const illnessRoutes = require('./routes/illness.routes')
const deviceRoutes = require('./routes/device.routes')

// Middlewares
app.use(cors())
app.use(express.json())

// API
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/health', healthRoutes)
app.use('/api/carers', carerRoutes)
app.use('/api/illnesses', illnessRoutes)
app.use('/api/devices', deviceRoutes)

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'))
})

// Archivos estáticos
app.use(express.static(path.join(__dirname, '../public')))

// Exportar la aplicación
module.exports = app