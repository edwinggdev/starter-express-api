const mongoose = require('mongoose')

const albumSchema = mongoose.Schema(
    {
        titulo:{
            type : String,
            require : true,
            trim : true
        },
        usuario: {
            type : String
        },
        usuario_id : {
            type: String
        },
        cantidad:{
            type: Number
        },
        fecha : {
            type: Date
        },
        cliente_id : {
            type: String
        },
        cliente_nombre : {
            type: String
        }
    }
)

module.exports = mongoose.model("album", albumSchema)