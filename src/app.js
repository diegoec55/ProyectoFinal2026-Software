const express = require ('express')
const app = express()
const path = require('path')
const cors = require('cors')

// connexion con la DB
const { sequelize, testConnection } = require('./config/database')

// rutas
const authRoutes = require('./routes/auth.routes')

//middlewares
app.use(cors()) //para evitar errores en el navegador
app.use(express.json())

//servir frontend
app.use(express.static(path.join(__dirname, '../public')))

// API
app.use('/api/auth', authRoutes)

//ruta principal
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, '../public/index.html'))
})

//puerto
const PORT = 3000

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
})