const path = require('path');
const fs   = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL ); // Configure Cloudinary

const { response } = require('express');
const { subirArchivo } = require('../helpers');

const { Usuario, Producto } = require('../models');


const cargarArchivo = async(req, res = response) => { // Indicated the res's type to have shortcuts


    try {
        
        // txt, md
        // const nombre = await subirArchivo( req.files, ['txt','md'], 'textos' );
        const nombre = await subirArchivo( req.files, undefined, 'imgs' );
        res.json({ nombre });

    } catch (msg) {
        res.status(400).json({ msg });
    }

}


const actualizarImagen = async(req, res = response ) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id); // Existing default method in all models
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
        
        break;

        case 'productos':
            modelo = await Producto.findById(id); // Existing default method in all models
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
        
        break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto'});
    }


    // Limpiar imágenes previas
    if ( modelo.img ) {
        // Hay que borrar la imagen del servidor
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
        if ( fs.existsSync( pathImagen ) ) {
            fs.unlinkSync( pathImagen ); // Delete a name and possibly the file it refers to
        }
    }


    const nombre = await subirArchivo( req.files, undefined, coleccion );
    modelo.img = nombre; // Store in the proper model into the field img, the url to the file in cloudinary

    await modelo.save(); // Existing default method in all models


    res.json( modelo );

}


const actualizarImagenCloudinary = async(req, res = response ) => {

    const { id, coleccion } = req.params; // Get the path params indicated in the request with ":"

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id); // Existing default method in all models
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
        
        break;

        case 'productos':
            modelo = await Producto.findById(id); // Existing default method in all models
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
        
        break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto'});
    }


    // Limpiar imágenes previas
    if ( modelo.img ) {
        const nombreArr = modelo.img.split('/');
        const nombre    = nombreArr[ nombreArr.length - 1 ];
        const [ public_id ] = nombre.split('.');
        cloudinary.uploader.destroy( public_id ); // Clean previous images in cloudinary
    }


    const { tempFilePath } = req.files.archivo // ".archivo" because it's the name chosen by us to send the files
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath ); // Upload a image
    modelo.img = secure_url; // Store in the corresponding model into the img field, the UploadApiResponse's secure_url

    await modelo.save(); // Existing default method in all models


    res.json( modelo );

}

const mostrarImagen = async(req, res = response ) => {

    const { id, coleccion } = req.params; // Get the path params indicated in the request with ":"

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id); // Existing default method in all models
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
        
        break;

        case 'productos':
            modelo = await Producto.findById(id); // Existing default method in all models
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
        
        break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto'});
    }


    // Limpiar imágenes previas
    if ( modelo.img ) {
        // Hay que borrar la imagen del servidor
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
        if ( fs.existsSync( pathImagen ) ) {
            return res.sendFile( pathImagen ) // Transfer a file at the given path
        }
    }

    const pathImagen = path.join( __dirname, '../assets/no-image.jpg'); // Send the image by default in case nothing found by the request
    res.sendFile( pathImagen ); // Transfer a file at the given path
}




module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}