const albumModel = require('../models/albumSchema')

const albumListar = async (req,res)=>{
   const albums = await albumModel.find()
   console.log( albums)
   res.status(200).json(albums)
}

const albumGuarda = (req,res)=>{
    console.log(req.body)
    try{
        const album = new albumModel(req.body)
        album.save()
        res.status(200).json({"msj": "ok" })

    }
    catch(err){
        console.log("error album Guarda "  + err)
    }
}

//obtener los datos del album
const albumObtener = async (req, res) => {
    const id  = req.params.id
    console.log(id)
    try{
        const c = await albumModel.findOne({_id:id}) 
        res.status(200).json(c)
    }catch(error){
        if(error){
            console.log("Error albumObtener" + error)
            res.status(400).send("Error albumObtener"); 
        }
    }
}

const albumActualizar = async  (req,res)=>{
    console.log(req.body)
    try{
        const { id, titulo, fecha, cantidad } = req.body 
        if(id == ''){
            res.status(400).send("id de Album No Valido")
        }
        
        if(titulo == ''){
            res.status(400).send("Titulo de Album No Valido")
        }else{
            const album = {}
            album.titulo = titulo
            album.fecha = fecha
            album.cantidad = cantidad
            const rta = await albumModel.updateOne(
                { _id : id},
                { $set : album},
                { new : true}
            )
            res.status(200).json({"msj": "Album Actualizado" })
        } 
    }catch(err){
        console.log("ERror AlbumActualizar" + err)
    }
}

//listar los albumes con el id del cliente
const albumClienteListar = async (req,res)=>{
    const id = req.params.id
    const albums = await albumModel.find({cliente_id: id })
    console.log( albums)
    res.status(200).json(albums)
 }

 //listar los albumnes del usuario(fotografo)
 const albumUsuarioListar = async (req,res)=>{
    const id = req.params.id
    const albums = await albumModel.find({usuario_id: id })
    console.log( albums)
    res.status(200).json(albums)
 }

module.exports = {
    albumListar,
    albumGuarda,
    albumObtener,
    albumClienteListar,
    albumUsuarioListar,
    albumActualizar
}