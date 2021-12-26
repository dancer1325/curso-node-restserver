const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = ( files, extensionesValidas = ['png','jpg','jpeg','gif'], carpeta = '' ) => {

    return new Promise( (resolve, reject) => {

        const { archivo } = files; // Destructuring because it's the name chosen by us to send the files
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[ nombreCortado.length - 1 ];

        // Validar la extension
        if ( !extensionesValidas.includes( extension ) ) {
            return reject(`La extensión ${ extension } no es permitida - ${ extensionesValidas }`);
        }
        
        const nombreTemp = uuidv4() + '.' + extension; // uuidv4() creates a RFC4122 uuid. Used to store the image wiht this name
        const uploadPath = path.join( __dirname, '../uploads/', carpeta, nombreTemp ); // __dirname is an environment variable by default in Node. It would tbe the current path
        // We want to crete a folder "uploads" at the same level to the controller folder, and __dirname is into controllers --> "__dirname, '../uploads/'

        archivo.mv(uploadPath, (err) => { // Move files stored in the uploadPath
            if (err) {
                reject(err);
            }

            resolve( nombreTemp );
        });

    });

}



module.exports = {
    subirArchivo
}