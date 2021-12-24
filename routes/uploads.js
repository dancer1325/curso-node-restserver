const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos, validarArchivoSubir } = require("../middlewares");
const {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary,
} = require("../controllers/uploads");
const { coleccionesPermitidas } = require("../helpers");

const router = Router(); // Create a router instance

router.post("/", validarArchivoSubir, cargarArchivo);

router.put( // Indicate path parameters with ":"
    "/:coleccion/:id", [
        validarArchivoSubir, //Customize validation middleware
        check("id", "El id debe de ser de mongo").isMongoId(), // Validation middlewares contained into express-validator
        check("coleccion").custom((c) => //Customize validation middleware indicated directly here
            coleccionesPermitidas(c, ["usuarios", "productos"])
        ),
        validarCampos, //Customize validation middleware
    ],
    actualizarImagenCloudinary
);
// ], actualizarImagen )

router.get( // Indicate path parameters with ":"
    "/:coleccion/:id", [
        check("id", "El id debe de ser de mongo").isMongoId(), // Validation middlewares contained into express-validator
        check("coleccion").custom((c) => //Customize validation middleware here
            coleccionesPermitidas(c, ["usuarios", "productos"])
        ),
        validarCampos, //Customize validation middleware
    ],
    mostrarImagen
);

module.exports = router;