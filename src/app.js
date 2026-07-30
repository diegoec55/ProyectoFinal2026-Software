const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')

// DB
const { sequelize, testConnection, seedDatabase } = require('./config/database')

// Importa todos los modelos desde index.js
const { User, Illness, Device, HealthRecord } = require('./models')

// rutas
const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')
const healthRoutes = require('./routes/health.routes')
const carerRoutes = require('./routes/carer.routes')
const illnessRoutes = require('./routes/illness.routes')
const deviceRoutes = require('./routes/device.routes');

//middlewares
app.use(cors())
app.use(express.json())

// probar conexión DB
testConnection()

// API
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api', healthRoutes)
app.use('/api/carers', carerRoutes)
app.use('/api/illnesses', illnessRoutes)
app.use('/api/devices', deviceRoutes);

// ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'))
})

// servir frontend
app.use(express.static(path.join(__dirname, '../public')))

//puerto
const PORT = 3000

async function startServer() {
    try {
        await testConnection()
        await sequelize.sync({ force: true })
        console.log('✓ Base de datos sincronizada')
        await seedDatabase({User,Illness,Device,HealthRecord})

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`)
        })

    } catch (error) {
        console.error(error)
    }
}

startServer()