const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')

// DB
const { sequelize, testConnection, seedDatabase } = require('./config/database')
const User = require('./models/User')

// Carga relaciones
require('./models')

// rutas
const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')
const healthRoutes = require('./routes/health.routes')
const carerRoutes = require('./routes/carer.routes')

//middlewares
app.use(cors())
app.use(express.json())

// probar conexión DB
testConnection()

// sincronizar modelos
sequelize.sync()

// sincronizar modelos (Cambiado a force: true temporalmente para resetear la base de datos)
// sequelize.sync({ force: true }) 
//     .then(() => console.log("Base de datos reseteada con los nuevos campos y relaciones"))

// carga de datos iniciales seed
seedDatabase(User)

// API
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api', healthRoutes)
app.use('/api/carers', carerRoutes)

// ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'))
})

// servir frontend
app.use(express.static(path.join(__dirname, '../public')))

//puerto
const PORT = 3000

// "0.0.0.0" sirve para la recepcion de datos del ESP32
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})