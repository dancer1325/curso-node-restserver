

const dbValidators = require('./db-validators');
const generarJWT   = require('./generar-jwt');
const googleVerify = require('./google-verify');
const subirArchivo = require('./subir-archivo');
// File created to export together the required functions into the folder /helpers
module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo,
}