const fotoModel = require('../models/fotoSchema')
const fs = require("node:fs")
const AWS = require("aws-sdk");
const s3 = new AWS.S3()
const bodyParser = require('body-parser');

const fotosListar = async (req,res)=>{
    try{
        const fotos = await fotoModel.find()
        console.log(fotos)

        res.status(200).json(fotos)
    }catch(err){
        if(err){
            console.log("Error fotoListar: " + err)
            res.status(400).json({msj:"Error fotosListar"})
        }
    }
}

const fotosAlbumListar = async (req,res)=>{
    const id = req.params.id
    try{
        const fotos = await fotoModel.find( {album_id : id})
        console.log(fotos)
        res.status(200).json(fotos)
    }catch(err){
        if(err){
            console.log("Error fotoListar: " + err)
            res.status(400).json({msj:"Error fotosListar"})
        }
    }
}

const fotoObtener = async (req, res) => {
    const id  = req.params.id
    console.log(id)
    try{
        const c = await fotoModel.findOne({_id:id}) 
        res.status(200).json(c)
    }catch(error){
        if(error){
            console.log("Error fotoObtener" + error)
            res.status(400).send("Error fotoObtener"); 
        }
    }
}

//guardar
const fotosGuarda =  (req,res)=>{
    console.log(req.body)
    try{
        const foto = new fotoModel(req.body)
        foto.save()
        res.send("foto Guardado")

    }
    catch(err){
        console.log("error fotosGuarda "  + err)
    }
    // res.send("ok")
}

const fotosActualizar = async  (req,res)=>{
    console.log(req.body)
    try{
        const { id, titulo, duracion, imagen } = req.body 
        if(id == ''){
            res.status(400).send("id de foto No Valido")
        }
        
        if(titulo == ''){
            res.status(400).send("Titulo de Pelicula No Valido")
        }else{
            //res.send('ok')
            const foto = {}
            foto.titulo = titulo
            foto.duracion = duracion
            foto.imagen = imagen
            const rta = await fotoModel.updateOne(
                { _id : id},
                { $set : foto},
                { new : true}
            )
            res.status(200).json({"msj": "foto Actualizado" })
        } 
    }catch(err){
        console.log("ERror fotosActualizar" + err)
    }
}

const fotosEliminar = async(req,res) =>{
    const id = req.params.id
    try{
        if(id == ''){
            res.status(400).send("El id No es Valido")
        }else{
            const rta = await fotoModel.deleteOne( { _id: id})
            res.status(200).send("foto Eliminado con Exito")
            console.log("Eliminado: " + id)
        }
    }catch(err){
        console.log("error fotosELiminar" + err)
    }
    // console.log(id)
    // res.send("eliminando...")
}

const fotosSubir = async(req,res)=>{ console.log("subiendo Archivo")
    try{
        let filename = req.path.slice(1)

        try {
            let s3File = await s3.getObject({
            Bucket: process.env.BUCKET,
            Key: filename,
            }).promise()

            res.set('Content-type', s3File.ContentType)
            res.send(s3File.Body.toString()).end()
        } catch (error) {
            if (error.code === 'NoSuchKey') {
            console.log(`No such key ${filename}`)
            res.sendStatus(404).end()
            } else {
            console.log(error)
            res.sendStatus(500).end()
            }
        }

        //metodo para subir imagen base 64
        //console.log(req.body)
        // const img = JSON.parse(JSON.stringify(req.body));
        // console.log(img.imagen)
        // let i = img.imagen
        // let base64Data = i.split(';base64,').pop();

        // const foto = new fotoModel()
        // const id = req.params.id
        // foto.album_id = id
        // foto.save()
        
        // fs.writeFileSync('public/images/'+ foto._id + '.jpg', base64Data,  {encoding: 'base64'});
        // res.status(200).json({msj: "ok"})

        //METODO para las imag que vienen desde formulario
        // console.log(req.file)
        // const filename = req.file.filename
        // console.log("recibiendo archivo" + filename)
        // const id = req.params.id
        // const foto = new fotoModel()
        // foto.album_id = id
        // foto.save()
        // fs.rename('./public/images/'+filename, './public/images/' + foto._id + '.jpg', ()=> { 
        //     console.log("cambio realizado") 
        // } )
        //res.status(200).json({msj: "ok"})
    }catch(err){
        res.status(400).json({msj:"problemas" + err})
    }
    
}

const fotoSeleccionar = async (req,res)=>{
    const id  = req.params.id
    console.log(id)
    try{
        const foto = await fotoModel.findOne({_id:id}) 
        let msj = ""
        if(foto.seleccionado){
            foto.seleccionado = false
            msj = "Foto Deseleccionada"
        }else{
            foto.seleccionado = true
            msj = "Foto Seleccionada"
        }
        const rta = await fotoModel.updateOne(
            { _id : id},
            { $set : foto},
            { new : true}
        )
        res.status(200).json({ "msj": msj })
    }catch(error){
        if(error){
            console.log("Error fotoSelecionar" + error)
            res.status(400).send("Error fotoSeleccionar"); 
        }
    }
}

const fotosSeleccionadas = async (req,res)=>{
    const id = req.params.id
    try{
        const fotos = await fotoModel.count({ seleccionado: "true", album_id: id })
        console.log(fotos)

        res.status(200).json(fotos)
    }catch(err){
        if(err){
            console.log("Error fotoListar: " + err)
            res.status(400).json({msj:"Error fotosListar"})
        }
    }
}

module.exports = {
    fotosListar,
    fotosGuarda,
    fotosActualizar,
    fotosEliminar,
    fotoObtener,
    fotosSubir,
    fotosAlbumListar,
    fotoSeleccionar,
    fotosSeleccionadas
}