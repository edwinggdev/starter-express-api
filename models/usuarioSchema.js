const mongoose = require('mongoose')

const usuarioSchema = mongoose.Schema(
    {
        correo: {
            type: String,
            require : true,
            trim : true
        },
        contrasena: {
            type: String,
            require : true,
            trim: true
        },
        nombre : {
            type: String,
            require,
            trim: true
        }
    }

)
module.exports = mongoose.model("usuario", usuarioSchema)