

const validaCampos = require('../middlewares/validar-campos');
const validarJWT   = require('../middlewares/validar-jwt');
const validaRoles  = require('../middlewares/validar-roles');
const validarArchivo = require('../middlewares/validar-archivo');
// File created to export together the required functions into the folder //middleware
module.exports = {
    ...validaCampos,
    ...validarJWT,
    ...validaRoles,
    ...validarArchivo
}