const fotoModel = require('../models/fotoSchema')
const fs = require("node:fs")
const AWS = require("aws-sdk");
const s3 = new AWS.S3()
const { Buffer } = require("node:buffer");
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


const photoUpload = async(req,res)=>{ console.log("subiendo archivo")
    try{
        console.log(req.body)
        const img = JSON.parse(JSON.stringify(req.body));
        console.log(img.imagen)
        let i = img.imagen
        let base64Data = i.split(';base64,').pop();

        const id = req.params.id
        const foto = new fotoModel()
        foto.album_id = id
        foto.save()

        const body={
            "upfile": base64Data,
            "filename": foto._id,
            "album": id
        }
        const options = {
            'method' : 'POST',
            body : body,
            headers : {
                "Content-Type" : "application/json"
                //,"x-auth-token" : token
            }
        }
        let res = fetch("https://www.fotomedios.com/selecta/files/", options)
        .then((response) => response.json())
        .then((json) => {
            console.log(json)
            res.status(200).json({msj: "ok"})
        })
        .catch(error => {
            console.log(error)
        })
    }catch(err){
        res.status(400).json({msj:"problemas" + err})
    }
}

const fotosNombre = async (req,res)=>{console.log("solicitando nombre para imagen")
    try{    
        const id = req.params.id // nombre del album
        const foto = new fotoModel()
        foto.album_id = id
        foto.save()
        res.status(200).json({msj: "ok", "name": foto.id})
    }catch(err){
        res.status(400).json({msj:"problemas" + err})
    }
}
const fotosSubir = async(req,res)=>{ console.log("subiendo Archivo")
    try{
        // const AWS_REGION="eu-west-1"
        // const AWS_ACCESS_KEY_ID="ASIAXZNAB2U3FJJEIHUL"
        // const AWS_SECRET_ACCESS_KEY="3S5sNM/oQe3UgL240+tPMnQPzLIz47e3510HF80S"
        // const AWS_SESSION_TOKEN="IQoJb3JpZ2luX2VjEIf//////////wEaCXNhLWVhc3QtMSJIMEYCIQCA2PoXDPIU8d7+6cigUz5gXx14ogHGO+gKlJJxlrO3bAIhANBgt89b02BiWhH3EOTByWbpxlc4KVXBddSilzt/FIFYKrkCCMD//////////wEQARoMNTM1NTk1OTYzNzAyIgxnHlzFJI4eowcXmbYqjQLlaNtD8VWgEwifsX3WE/Ayn4EKm0d2MMELb+55AuvGwcN5iK3Ti4aUg2YxrQaTnlMKSclsdLs2Gexdsnn+raF3Uz0ouPlS623HtZ/54a/MuJCbmAqW4zbloLdB2UfpRRNS4nTAy6OhV+jMP80nXNNDSDke7vhucCIxMZozzass/gJ4h0Y/mNu8LYwdVCYdq/uwbicto0X6IcWqDmVcYtL+0S6DdU3zNU9EDSvEyQxss9ZjOn/Bpo6ze61FydLKgjRIHfx1GmXBY3gMAV2brrEh6P8xrPVXeQPdPeSxcGkZpWWYS8YSWYeO+D13fEp9RxacjpvK0m3rvolOuCuaXcguyFxw0RQ8TK1m5J2KUjDHuq6qBjqcAZUtT43Q2Q15fUhPL/bAJ3+oSM+2qYOyMX79gxt+YnAQpAd3Jplru/+GAFLcI8W/ps6eTHYI3lF0CB7rhVp20RRLcPRgauu0uSfUImyNIxDqYTXyBcX70PCtbibqk5LnNkwJHQQZIhcKRWfQElkH1i0rT6Lrys+BQRDONroe9A/YjcBgUWl27SFfBM+pibByY+D5S9vmSWOxE8qXaw=="
        // const s3 = new AWS.S3({
        //     accessKeyId: AWS_ACCESS_KEY_ID,
        //     secretAccessKey: AWS_SECRET_ACCESS_KEY,
        //   })

        
        // const imageURL = 'https://www.ginga.com.co/wp-content/uploads/2021/02/logopagina-1.png'
        // const res = await fetch(imageURL)
        // //const blob = await res.Buffer() //buffer()
        // let blob = res.split(';base64,').pop();

        // const img = JSON.parse(JSON.stringify(req.body));
        // console.log(img.imagen)
        // let i = img.imagen
        // let base64Data = i.split(';base64,').pop();
        // const uploadedImage = await s3.upload({
        // Bucket: "cyclic-fair-blue-buffalo-vest-eu-west-1",
        // Key: req.files[0].originalFilename,
        // Body: base64Data,
        // }).promise()

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
    fotosSeleccionadas,
    photoUpload,
    fotosNombre
}