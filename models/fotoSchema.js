const mongoose = require('mongoose')

const fotoSchema = mongoose.Schema(
    {
        // titulo: { 
        //     type: String,
        //     require : true,
        //     trim: true
        // },
 	    album_id : {
            type: String,
            require : true,
            trim: true
        },
        seleccionado :{
            type : Boolean
        }
    }
)
module.exports = mongoose.model("foto", fotoSchema )