const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')

// DB
const { sequelize, testConnection } = require('./config/database')
const User = require('./models/User')

// rutas
const authRoutes = require('./routes/auth.routes')

//middlewares
app.use(cors())
app.use(express.json())

// probar conexión DB
testConnection()

// sincronizar modelos
sequelize.sync()

// CREAR USUARIO DE PRUEBA (ejecutar una sola vez)
async function crearUsuario() {
    try {
        const existe = await User.findOne({ where: { email: 'test@test.com' } })

        if (!existe) {
            await User.create({
                email: 'test@test.com',
                password: '1234'
            })
            console.log('✔ Usuario de prueba creado')
        } else {
            console.log('⚠ Usuario ya existe')
        }

    } catch (error) {
        console.error('Error creando usuario:', error)
    }
}

// descomentar para crear un usuario UNA VEZ
// crearUsuario()

//servir frontend
app.use(express.static(path.join(__dirname, '../public')))

// API
app.use('/api/auth', authRoutes)

//ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'))
})

//puerto
const PORT = 3000

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})