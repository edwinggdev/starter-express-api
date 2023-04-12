const mongoose = require('mongoose')

const clienteSchema = mongoose.Schema(
    {
        nombre : {
            type: String,
            require,
            trim: true
        },
        correo: {
            type: String,
            require : true,
            trim : true
        },
        contacto: {
            type: String,
            require : true,
            trim: true
        }
    }

)
module.exports = mongoose.model("cliente", clienteSchema)