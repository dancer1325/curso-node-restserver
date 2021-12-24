const { Router } = require("express");
const { check } = require("express-validator");

const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole,
} = require("../middlewares"); // Look for the index.js file into this path

const {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
} = require("../helpers/db-validators"); // Look for the index.js file into this path

const {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch,
} = require("../controllers/usuarios");

const router = Router(); // Call router, but no creating a router instance

// Base paths are indicated in the routes into the server.js -- Here won't appear the rest
router.get("/", usuariosGet); // You can specify the callback in another class

router.put( // Indicate path parameters with ":"
    "/:id", [
        check("id", "No es un ID válido").isMongoId(), // Validation middlewares contained into express-validator
        check("id").custom(existeUsuarioPorId), //Customize validation middleware
        // check("id").custom((id) => existeUsuarioPorId(id)), // It's the same to the previous one, but indicating all in the arrow function
        check("rol").custom(esRoleValido), //Customize validation middleware. Arrow function, assuming that there is just 1 argument
        //check("rol").custom((rol) => esRoleValido(rol)), // It's the same to the previous one, but indicating all in the arrow function
        validarCampos, //Customize validation middleware
    ],
    usuariosPut
);

router.post(
    "/", [
        check("nombre", "El nombre es obligatorio").not().isEmpty(), // Validation middlewares contained into express-validator
        check("password", "El password debe de ser más de 6 letras").isLength({ // Validation middlewares contained into express-validator
            min: 6,
        }),
        check("correo", "El correo no es válido").isEmail(), // Validation middlewares contained into express-validator
        check("correo").custom(emailExiste), //Customize validation middleware
        // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
        //check("correo").custom((correo) => emailExiste(correo)), // It's the same to the previous one, but indicating all in the arrow function
        check("rol").custom(esRoleValido), //Customize validation middleware
        //check("rol").custom((rol) => esRoleValido(rol)), // It's the same to the previous one, but indicating all in the arrow function
        validarCampos, //Customize validation middleware
    ],
    usuariosPost
);

router.delete( // Indicate path parameters with ":"
    "/:id", [
        validarJWT, //Customize validation middleware
        // esAdminRole,
        tieneRole("ADMIN_ROLE", "VENTAR_ROLE", "OTRO_ROLE"), //Customize validation middleware
        check("id", "No es un ID válido").isMongoId(), // Validation middlewares contained into express-validator
        check("id").custom(existeUsuarioPorId), //Customize validation middleware
        //check("id").custom((id) => existeUsuarioPorId(id)), // It's the same to the previous one, but indicating all in the arrow function
        validarCampos, //Customize validation middleware
    ],
    usuariosDelete
);

router.patch("/", usuariosPatch);

module.exports = router;