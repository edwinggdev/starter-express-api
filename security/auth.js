const jwt = require('jsonwebtoken')

module.exports = async (req,res,next) =>{
    const token = req.header("x-auth-token")

    if(!token){
        res.status(400).json({ msj: "Token no encontrado" })
    }
    
    try{
        const payload = jwt.verify(token, "palabrasecreta")
        req.usuario = payload.nombre 
        console.log("token confirmado. ")
        console.log(payload)
        next()
    }catch(err){  console.log("...")  
        res.status(400).json({ msj: "Error e Token"})
    }
    
}