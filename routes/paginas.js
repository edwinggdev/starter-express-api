const express = require('express')
const router = express.Router()

router.get('/', (req,res) =>{
    res.send('Pagina Acerca de....')
})

module.exports = router