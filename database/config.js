const mongoose = require('mongoose');



const dbConnection = async() => {

    try {
        console.log('MongoDB url' + process.env.MONGODB_CNN);

        await mongoose.connect( process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true, // Necessary property to create indexes
            useFindAndModify: false
        });
    
        console.log('Base de datos online');

    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la base de datos');
    }


}



module.exports = {
    dbConnection
}
