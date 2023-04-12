const express = require('express')
const router = express.Router()
const clientesCtrl = require('../controllers/clientesCtrl')

router.get('/',clientesCtrl.clientesListar)
router.get('/:id', clientesCtrl.clienteObtener)
router.get('/album/:id',)
router.post('/', clientesCtrl.clientesGuarda )
router.put('/', clientesCtrl.clientesActualizar)
router.delete('/:id', clientesCtrl.clientesEliminar)
module.exports = router