const usuarioModel = require('../models/usuarioSchema')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const usuarioGuarda = async (req,res)=>{
    console.log(req.body)
    //res.send("...")
    try{
        const usuario = new usuarioModel(req.body)
        const salt = await bcrypt.genSaltSync(10);
        usuario.contrasena = await bcrypt.hash(usuario.contrasena,salt)
        console.log("contrasena generada: " + usuario.contrasena)
        await usuario.save()
        res.status(200).json({msj: "usuario creado"})

    }catch(err){
        console.log(err)
        res.status(400).json({ msj: "error guardando" })
    }
}

const usuarioLogin = async (req,res) =>{
    console.log("intento de login")
    console.log(req.body)
    //
    const { correo, contrasena } = req.body
    try{
        errores = false
        if(correo ==""){ errores = true
            res.status(400).json({ msj: "Correo Incorrecto" })
        }
        if(contrasena==''){ errores=true
            res.status(400).json({ msj:"Contraseña Incorrecta" })
        }

        if(!errores){
            //validar
            let usuario = await usuarioModel.findOne({ 'correo' : correo  })
            //res.send("accesando....")
            let correcto = false
            console.log(contrasena + " , " + usuario.contrasena)
            correcto = await bcrypt.compare(contrasena,usuario.contrasena)
            if(!correcto){
                console.log("no encontrado...")
                res.status(400).json({ response: "no", msj:"Datos de Acceso incorrecto" })
            }else{
                console.log("usuario" + usuario.nombre)
                //res.status(200).json({ msj: "ok"})
                //generar token
                const payload = {
                    usuario : { id: usuario.id ,
                                nombre : usuario.nombre  }
                }
                jwt.sign(
                    payload,
                    "palabrasecreta",
                    (error, token)=>{
                        if(error) throw error
                        res.status(200).json({ response: "ok", "token" : token })
                    }
                )
            }
            
        }
    }catch(err){ console.log("error usuarioLogin "  + err)    
    }
}

const usuarioRegistro = async (req,res)=>{
    console.log(req.body)
    //res.send("...")
    try{
        const usuario = new usuarioModel(req.body)
        //validar el correo
        let usu = await usuarioModel.findOne({ 'correo' : usuario.correo  })
        if(usu){
            res.status(400).json({msj: usuario.nombre + ", el correo " + usuario.correo  + " ya se encuentra registrado", response : 'no'})
        }else{
            const contrasena = createPassword(6,false,false)
            const salt = await bcrypt.genSaltSync(10);
            usuario.contrasena = await bcrypt.hash(contrasena,salt)
            console.log("contrasena generada: " + contrasena)
            await usuario.save()
            CorreoEnviar(usuario.correo, usuario.nombre, contrasena)
            res.status(200).json({msj: "Usuario Registrado Correctamente", response : 'ok'})
        } 
    }catch(err){
        console.log(err)
        res.status(400).json({ msj: "Error Registrando al usuario" })
    }
}

function CorreoEnviar(correo,nombre,contrasena){
    const nodemailer = require("nodemailer");

    // Create a transporter instance with your email service provider's SMTP details
    const transporter = nodemailer.createTransport({
    service: "Gmail", // Replace with your email service provider
    auth: {
        user: "ginga.soluciones@gmail.com", // Replace with your email address
        pass: "xdzwxhnmrahhmvcx", // Replace with your email password
    },
    });

    // Define the email options, including the HTML body with an image
    const mailOptions = {
    from: "info@fotomedios.com", // Replace with your email address
    to: correo, // Replace with the recipient's email address
    subject: "Registro en Selecta", // Replace with the email subject
    html: `
        <h1>Hola ` + nombre + `</h1>
        <p>Tu registro a nuestra apliacion Selecta ha sido satisfactorio.</p>
        <p>Se ha generado una contraseña de ingreso:</p>
        <p><h3>`+ contrasena + `</h3></p>
        <p>Para ingregar a la plataforma haz click <a href="">Aqui</a></p>
        <img src="https://www.ginga.com.co/wp-content/uploads/2021/02/logopagina-1.png" alt="logo ginga.com.co"> 
        <p>Gracias por hacer uso de esta plataforma!</p>
        <p><img src="view-source:https://www.fotomedios.com/wp-content/uploads/2021/03/cropped-logo-180x180.png" alt="logo fotomedios">
        <a href="https://www.fotomedios.com">Fotomedios</a>
    `, // Replace with your HTML template
    };

    // Use the transporter instance to send the email
    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error("Error sending email: ", error);
    } else {
        console.log("Email sent: ", info.response);
    }
    });
}

const alpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const integers = "0123456789";
const exCharacters = "!@#$%^&*_-=+";
const createPassword = (length, hasNumbers, hasSymbols) => {
    let chars = alpha;
    if (hasNumbers) {
        chars += integers;
    }
    if (hasSymbols) {
        chars += exCharacters;
    }
    return generatePassword(length, chars);
};

const generatePassword = (length, chars) => {
    let password = "";
    for (let i = 0; i < length; i++) {
        let aleatorio = Math.random()
        console.log("aleatorio",aleatorio)
        password += chars.toString().charAt(Math.floor(aleatorio * chars.length));
    }
    return password;
};

module.exports = {
    usuarioLogin,
    usuarioGuarda,
    usuarioRegistro
}