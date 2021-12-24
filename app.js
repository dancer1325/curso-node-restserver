//require('dotenv').config(); // Using the default file
require("dotenv").config({ path: ".example.env" }); // Manage environment variables
const Server = require("./models/server");

const server = new Server(); // Invoke the constructor of the Server class

server.listen(); // Invoke the listen method of the express instance