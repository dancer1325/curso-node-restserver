const { Router } = require("express"); // Router express object
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");

const { login, googleSignin } = require("../controllers/auth");

const router = Router(); // Create a router instance

router.post(
    // Will manage any post request which ends in '/login'
    "/login", [
        check("correo", "El correo es obligatorio").isEmail(), // Validation middlewares contained into express-validator
        check("password", "La contraseña es obligatoria").not().isEmpty(), // Validation middlewares contained into express-validator
        validarCampos, //Customize validation middleware
    ],
    login
);

router.post(
    // Will manage any post request which ends in '/google'
    "/google", [
        check("id_token", "El id_token es necesario").not().isEmpty(), // Validation middlewares contained into express-validator
        validarCampos, //Customize validation middleware
    ],
    googleSignin
);

module.exports = router;