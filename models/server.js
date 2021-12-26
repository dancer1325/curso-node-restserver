const express = require("express"); // Use express package to manage webserver
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { dbConnection } = require("../database/config");

class Server {
    // Class to manage the express app
    constructor() {
        this.app = express(); // Create express app. Use this because it's in that context
        this.port = process.env.PORT; // Manage the variable port indicated in the .env file

        this.paths = {
            // Define all the paths to the different pages
            auth: "/api/auth",
            buscar: "/api/buscar",
            categorias: "/api/categorias",
            productos: "/api/productos",
            usuarios: "/api/usuarios",
            uploads: "/api/uploads",
        };

        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        // CORS -- Mount the specific cors middleware function
        this.app.use(cors());

        // Lectura y parseo del body -- Mount the specific middleware function for parsing incoming requests with json as payload
        this.app.use(express.json());

        // Directorio Público -- Mount the specific middleware function for serving static files
        this.app.use(express.static("public")); // Indicate the static webServer folder in which to look for the index.html

        // Fileupload - Carga de archivos -- Mount the specific middleware function for accessing to the files previously loaded
        this.app.use(
            fileUpload({
                useTempFiles: true, // Use temp files for managing the upload process
                tempFileDir: "/tmp/",
                createParentPath: true, // If you invoke .mv and there is no folder --> Create it automatically
            })
        );
    }

    routes() {
        this.app.use(this.paths.auth, require("../routes/auth")); // Mount the middleware function at the specified path with a callback
        this.app.use(this.paths.buscar, require("../routes/buscar")); // Mount the middleware function at the specified path with a callback
        this.app.use(this.paths.categorias, require("../routes/categorias")); // Mount the middleware function at the specified path with a callback
        this.app.use(this.paths.productos, require("../routes/productos")); // Mount the middleware function at the specified path with a callback
        this.app.use(this.paths.usuarios, require("../routes/usuarios")); // Mount the middleware function at the specified path with a callback
        this.app.use(this.paths.uploads, require("../routes/uploads")); // Mount the middleware function at the specified path with a callback
    }

    listen() {
        // Method to indicate the port of the express app
        this.app.listen(this.port, () => {
            console.log("Servidor corriendo en puerto", this.port);
        });
    }
}

module.exports = Server;