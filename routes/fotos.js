const express = require('express')
const router = express.Router()
const fotosCtrl = require('../controllers/fotosCtrl')
const multer = require('multer')
const upload = multer({dest : "public/images/"})

router.get('/',fotosCtrl.fotosListar)
router.get('/:id', fotosCtrl.fotoObtener)
router.get('/album/:id',fotosCtrl.fotosAlbumListar)
router.post('/', fotosCtrl.fotosGuarda )
router.put('/', fotosCtrl.fotosActualizar)
router.delete('/:id', fotosCtrl.fotosEliminar)
// router.put('/images/:id',
//             upload.single('imagen'),
//             fotosCtrl.fotosSubir
//             )
router.put('/images/:id',
           
            fotosCtrl.fotosSubir
            )
router.put('/:id', fotosCtrl.fotoSeleccionar)
router.get('/album/seleccionadas/:id',fotosCtrl.fotosSeleccionadas)
module.exports = router