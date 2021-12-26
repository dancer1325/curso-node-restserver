const { response } = require("express")


const validarArchivoSubir = (req, res = response, next ) => {

    console.log(req.files); // Array with the files uploaded
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) { // ".archivo" because it's the name chosen by us to send the files
        return res.status(400).json({
            msg: 'No hay archivos que subir - validarArchivoSubir'
        });
    }

    next();

}


module.exports = {
    validarArchivoSubir
}
