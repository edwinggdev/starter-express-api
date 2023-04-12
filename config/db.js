const mongoose = require('mongoose')
//const URIDB = "mongodb://localhost:27017/selecta"
const URIDB = "mongodb+srv://ciclo4:unab2022@cluster0.rv59jh6.mongodb.net/?retryWrites=true&w=majority"

module.exports = ()=>{
    const conn = ()=>{
        mongoose.connect(
            URIDB,
            {
                keepAlive : true,
                useNewUrlParser : true,
                useUnifiedTopology : true
            },
            (err)=>{
                if(err){
                    console.log("Error conn" + err)
                }else{
                    console.log("Conexion Satisfactoria")
                }
            }
        )
    }
    conn()
}