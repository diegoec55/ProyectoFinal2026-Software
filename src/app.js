const express = require ('express')
const app = express()
const path = require('path')

//configurar EJS
app.set('view engine','ejs')

//configuro para que detecte las views
app.set('views', path.join(__dirname,'views'))

//archivos static
app.use(express.static(path.join(__dirname,'../public')))

//ruta principal
app.get('/',(req,res)=>{
    res.render('index',{title:'Proyecto 2026'})
})

//puerto
const PORT = 3000

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
})