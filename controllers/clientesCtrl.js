const clienteModel = require('../models/clienteSchema')
const clientesListar = async (req,res)=>{
    try{
        const clientes = await clienteModel.find()
        console.log(clientes)

        res.status(200).json(clientes)
    }catch(err){
        if(err){
            console.log("Error clientesListar: " + err)
            res.status(400).json({msj:"Error clientesListar"})
        }
    }
}

const clientesListarAlbum = async (req,res)=>{
    try{
        const clientes = await clienteModel.find()
        console.log(clientes)

        res.status(200).json(clientes)
    }catch(err){
        if(err){
            console.log("Error clienteListar: " + err)
            res.status(400).json({msj:"Error clientesListar"})
        }
    }
}

const clienteObtener = async (req, res) => {
    const id  = req.params.id
    console.log(id)
    try{
        const c = await clienteModel.findOne({_id:id}) 
        res.status(200).json(c)
    }catch(error){
        if(error){
            console.log("Error clienteObtener" + error)
            res.status(400).send("Error clienteObtener"); 
        }
    }
}

//guardar
const clientesGuarda =  (req,res)=>{
    console.log(req.body)
    try{
        const cliente = new clienteModel(req.body)
        cliente.save()
        res.status(200).json({"msj": "ok" })

    }
    catch(err){
        console.log("error clientesGuarda "  + err)
    }
    // res.send("ok")
}

const clientesActualizar = async  (req,res)=>{
    console.log(req.body)
    try{
        const { id, nombre, contacto, correo } = req.body 
        if(id == ''){
            res.status(400).send("id de cliente No Valido")
        }
        
        if(nombre == ''){
            res.status(400).send("Nombre de Cliente No Valido")
        }else{
            //res.send('ok')
            const cliente = {}
            cliente.nombre = nombre
            cliente.contacto = contacto
            cliente.correo = correo
            const rta = await clienteModel.updateOne(
                { _id : id},
                { $set : cliente},
                { new : true}
            )
            res.status(200).json({"msj": "cliente Actualizado" })
        } 
    }catch(err){
        console.log("ERror clientesActualizar" + err)
    }
}

const clientesEliminar = async(req,res) =>{
    const id = req.params.id
    try{
        if(id == ''){
            res.status(400).send("El id No es Valido")
        }else{
            const rta = await clienteModel.deleteOne( { _id: id})
            res.status(200).send("cliente Eliminado con Exito")
            console.log("Eliminado: " + id)
        }
    }catch(err){
        console.log("error clientesELiminar" + err)
    }
    // console.log(id)
    // res.send("eliminando...")
}

module.exports = {
    clientesListar,
    clientesGuarda,
    clientesActualizar,
    clientesEliminar,
    clienteObtener
}