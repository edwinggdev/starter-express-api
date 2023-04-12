const express = require('express')
const router = express.Router()
const usuariosCtrl = require('../controllers/usuariosCtrl')

router.post('/', usuariosCtrl.usuarioGuarda)
router.post('/login/' , usuariosCtrl.usuarioLogin)
router.post('/registro/' , usuariosCtrl.usuarioRegistro)
module.exports = router
