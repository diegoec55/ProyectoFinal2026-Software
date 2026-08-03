const app = require('./app')

// DB
const { sequelize, testConnection, seedDatabase } = require('./config/database')

// Modelos
const { User, Illness, Device, HealthRecord } = require('./models')

// Puerto
const PORT = 3000

async function startServer() {
    try {
        await testConnection()
        await sequelize.sync({ force: true })
        console.log('✓ Base de datos sincronizada')

        await seedDatabase({ User, Illness, Device, HealthRecord })
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`)
        })

    } catch (error) {
        console.error(error)
    }
}

startServer()
//app.js sabe cómo funciona la aplicación.
//server.js sabe cómo arrancarla.