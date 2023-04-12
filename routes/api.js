const express = require('express')
const router = express.Router()

router.get('/peliculas', (req,res) =>{
    res.send('Listado de peliculas')
})

router.get('/series', (req,res)=>{
    res.send('Listado de Series')
})

module.exports = router