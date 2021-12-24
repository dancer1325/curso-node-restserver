const jwt = require('jsonwebtoken');



const generarJWT = ( uid = '' ) => {

    return new Promise( (resolve, reject) => {

        const payload = { uid };

        // Generate JWT, based on the uid and a secret
        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h' // Valid time previous to expire this JWT generated
        }, ( err, token ) => { // 1º argument is always the error, 2º argument is always the JWT generated

            if ( err ) {
                console.log(err);
                reject( 'No se pudo generar el token' )
            } else {
                resolve( token ); // Continue with the execution
            }
        })

    })
}




module.exports = {
    generarJWT
}

