

const Categoria = require('./categoria');
const Producto = require('./producto');
const Role = require('./role');
const Server = require('./server');
const Usuario = require('./usuario');

// Class to export all models globally, instead of doing one by one

module.exports = {
    Categoria,
    Producto,
    Role,
    Server,
    Usuario,
}

