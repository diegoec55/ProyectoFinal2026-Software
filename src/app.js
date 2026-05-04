const express = require ('express')
const app = express()
const path = require('path')
const cors = require('cors')

//middlewares
app.use(cors())
app.use(express.json())

//servir frontend
app.use(express.static(path.join(__dirname, '../public')))

//ruta principal
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, '../public/index.html'))
})

//puerto
const PORT = 3000

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
})