const express = require('express')
const app = express()
const puerto = 3000
const db = require('./config/db')
const cors = require('cors')
//probando el controlador
// const fotos = require('./controllers/fotosCtrl')
// console.log(fotos.fotosListar())
// const albums = require('./controllers/albumsCtrl')
// albums.albumListar()
app.get('/', (req,res)=>{
    res.send("Hola G04")
})

// app.get('/about', (req,res)=>{
//     res.send("Pagina Acerca de...")
// })
//rutas
app.use(express.json())
app.use(cors())
app.use('/about', require('./routes/paginas'))
app.use('/api', require('./routes/api'))
app.use('/api/fotos', require('./routes/fotos') )
app.use('/api/albunes',require('./routes/albunes'))
app.use('/api/usuarios', require('./routes/usuarios') )
app.use('/api/clientes', require('./routes/clientesRoute') )
app.use('/images',express.static('public/images'))
app.listen(puerto, ()=>{
    console.log('Servidor Activo, puerto: ' + puerto)
})
db()
