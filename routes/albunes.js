const  express = require('express')
const router = express.Router()
const albumCtrl = require('../controllers/albumsCtrl')
const auth = require('../security/auth')
router.get('/', albumCtrl.albumListar)
router.get('/:id', albumCtrl.albumObtener)
router.get('/cliente/:id', albumCtrl.albumClienteListar)
router.get('/usuario/:id', albumCtrl.albumUsuarioListar)
router.post('/', auth,albumCtrl.albumGuarda)
router.put('/', albumCtrl.albumActualizar )

module.exports = router