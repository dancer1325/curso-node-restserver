const { Router } = require("express");
const { check } = require("express-validator");

const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");

const {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria,
} = require("../controllers/categorias");
const { existeCategoriaPorId } = require("../helpers/db-validators");

const router = Router(); // Create a router instance

/**
 * {{url}}/api/categorias
 */

//  Obtener todas las categorias - publico
router.get("/", obtenerCategorias);

// Obtener una categoria por id - publico
router.get( // Indicate path parameters with ":"
    "/:id", [
        check("id", "No es un id de Mongo válido").isMongoId(), // Validation middlewares contained into express-validator
        check("id").custom(existeCategoriaPorId), // Customize validation
        //check("id").custom((id) => existeCategoriaPorId(id)), // It's the same to the previous one, but indicating all in the arrow function
        validarCampos, //Customize validation middleware
    ],
    obtenerCategoria
);

// Crear categoria - privado - cualquier persona con un token válido
router.post(
    "/", [
        validarJWT, //Customize validation middleware
        check("nombre", "El nombre es obligatorio").not().isEmpty(), // Validation middlewares contained into express-validator
        validarCampos, //Customize validation middleware
    ],
    crearCategoria
);

// Actualizar - privado - cualquiera con token válido
router.put( // Indicate path parameters with ":"
    "/:id", [
        validarJWT,
        check("nombre", "El nombre es obligatorio").not().isEmpty(), // Validation middlewares contained into express-validator
        check("id").custom(existeCategoriaPorId), //Customize validation middleware
        //check("id").custom((id) => existeCategoriaPorId(id)), //It's the same to the previous one, but indicating all in the arrow function
        validarCampos, //Customize validation middleware
    ],
    actualizarCategoria
);

// Borrar una categoria - Admin
router.delete( // Indicate path parameters with ":"
    "/:id", [
        validarJWT,
        esAdminRole, //Customize validation middleware
        check("id", "No es un id de Mongo válido").isMongoId(), // Validation middlewares contained into express-validator
        check("id").custom(existeCategoriaPorId), //Customize validation middleware
        //check("id").custom((id) => existeCategoriaPorId(id)), // It's the same to the previous one, but indicating all in the arrow function
        validarCampos, //Customize validation middleware
    ],
    borrarCategoria
);

module.exports = router;