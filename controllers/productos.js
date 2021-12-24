const { response } = require('express');
const { Producto } = require('../models');


const obtenerProductos = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query; // For getting query params. Nothing has to be added in the route class
    const query = { estado: true };

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query), // Existing default method in all models
        Producto.find(query) // Existing default method in all models
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        productos
    });
}

const obtenerProducto = async(req, res = response ) => {

    const { id } = req.params; // Get the path params indicated in the request with ":"
    const producto = await Producto.findById( id ) // Existing default method in all models
                            .populate('usuario', 'nombre')
                            .populate('categoria', 'nombre');

    res.json( producto );

}

const crearProducto = async(req, res = response ) => {

    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({ nombre: body.nombre }); // Existing default method in all models

    if ( productoDB ) {
        return res.status(400).json({
            msg: `El producto ${ productoDB.nombre }, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto( data );

    // Guardar DB
    await producto.save(); // Existing default method in all models

    res.status(201).json(producto);

}

const actualizarProducto = async( req, res = response ) => {

    const { id } = req.params; // Get the path params indicated in the request with ":"
    const { estado, usuario, ...data } = req.body;

    if( data.nombre ) {
        data.nombre  = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true }); // Existing default method in all models

    res.json( producto );

}

const borrarProducto = async(req, res = response ) => {

    const { id } = req.params; // Get the path params indicated in the request with ":"
    const productoBorrado = await Producto.findByIdAndUpdate( id, { estado: false }, {new: true }); // Existing default method in all models

    res.json( productoBorrado );
}




module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}