const { validationResult } = require('express-validator');

// Customize validation middleware
// Placed at the end of the all middleware functions, because it can read all the errors got in the previous validation middleware functions
const validarCampos = ( req, res, next ) => {

    const errors = validationResult(req); // Get all the validations errors got from the request
    if( !errors.isEmpty() ){
        return res.status(400).json(errors);
    }

    next(); // Go to the next middleware or controller
}



module.exports = {
    validarCampos
}
