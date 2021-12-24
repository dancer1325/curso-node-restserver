const { response, request } = require('express');
const bcryptjs = require('bcryptjs');


const Usuario = require('../models/usuario'); //Name convention to define the model


// Necessary to specify the type to access to the properties
const usuariosGet = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query; // For getting query params. Nothing has to be added in the route class. Indicate default parameters
    const query = { estado: true };

    // 1) Launching requests sequentially
    // const total = await Usuario.countDocuments(query);
    // const usuarios = Usuario.find(query)
    //     .skip( Number( desde ) )
    //     .limit(Number( limite ));

    // 2) Launching requests parallel
    const [ total, usuarios ] = await Promise.all([ // Promise.all launch several await requests in parallel
         // Existing default method in all models. "query" is an object to filter the documents to get
        // Usuario.count(query), // Deprecated method
        Usuario.find(query) // Existing default method in all models
            .skip( Number( desde ) ) // Since req.query params are string, and we need numbers --> We need to cast them
            .limit(Number( limite )) // Maximum number of registers to return
    ]);

    res.json({ // Create the structure of the object to return
        total,
        usuarios
    });
}

const usuariosPost = async(req, res = response) => {
    
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync(); // Sync use. Salt is  the number of iterations to find the hash function
    usuario.password = bcryptjs.hashSync( password, salt ); //Getting the password encrypted

    // Guardar en BD
    await usuario.save(); // Existing default method in all models

    res.json({
        usuario
    });
}

const usuariosPut = async(req, res = response) => {

    const { id } = req.params; // Get the path params indicated in the request with ":"
    const { _id, password, google, correo, ...resto } = req.body;

    if ( password ) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto ); // Existing default method in all models

    res.json(usuario);
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

const usuariosDelete = async(req, res = response) => {

    const { id } = req.params; // Get the path params indicated in the request with ":"

    // 1) Update the register as disable
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } ); // Existing default method in all models

    // 2) Delete definitively the register in the database
    //const usuario = await Usuario.findByIdAndDelete(id); // Existing default method in all models
    
    res.json(usuario);
}




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}