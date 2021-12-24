const { Router } = require("express");
const { check } = require("express-validator");

const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");

const {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto,
} = require("../controllers/productos");

const {
    existeCategoriaPorId,
    existeProductoPorId,
} = require("../helpers/db-validators");

const router = Router(); // Create a router instance

/**
 * {{url}}/api/categorias
 */

//  Obtener todas las categorias - publico
router.get("/", obtenerProductos);

// Obtener una categoria por id - publico
router.get( // Indicate path parameters with ":"
    "/:id", [
        check("id", "No es un id de Mongo válido").isMongoId(), // Validation middlewares contained into express-validator
        check("id").custom(existeProductoPorId), //Customize validation middleware
        //check("id").custom((id) => existeProductoPorId(id)), // It's the same to the previous one, but indicating all in the arrow function
        validarCampos, //Customize validation middleware
    ],
    obtenerProducto
);

// Crear categoria - privado - cualquier persona con un token válido
router.post(
    "/", [
        validarJWT, //Customize validation middleware
        check("nombre", "El nombre es obligatorio").not().isEmpty(), // Validation middlewares contained into express-validator
        check("categoria", "No es un id de Mongo").isMongoId(), // Validation middlewares contained into express-validator
        check("categoria").custom(existeCategoriaPorId), //Customize validation middleware
        //check("categoria").custom((id) => existeCategoriaPorId(id)), //It's the same to the previous one, but indicating all in the arrow function
        validarCampos, //Customize validation middleware
    ],
    crearProducto
);

// Actualizar - privado - cualquiera con token válido
router.put( // Indicate path parameters with ":"
    "/:id", [
        validarJWT, //Customize validation middleware
        // check('categoria','No es un id de Mongo').isMongoId(),
        check("id").custom(existeProductoPorId), //Customize validation middleware
        //check("id").custom((id) => existeProductoPorId(i)), // It's the same to the previous one, but indicating all in the arrow function
        validarCampos, //Customize validation middleware
    ],
    actualizarProducto
);

// Borrar una categoria - Admin
router.delete( // Indicate path parameters with ":"
    "/:id", [
        validarJWT, //Customize validation middleware
        esAdminRole, //Customize validation middleware
        check("id", "No es un id de Mongo válido").isMongoId(), // Validation middlewares contained into express-validator
        check("id").custom(existeProductoPorId), //Customize validation middleware
        //check("id").custom((id) => existeProductoPorId(id)), //It's the same to the previous one, but indicating all in the arrow function
        validarCampos, //Customize validation middleware
    ],
    borrarProducto
);

module.exports = router;