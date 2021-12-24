const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true // Indicate that this property is an index
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});


CategoriaSchema.methods.toJSON = function() { // Add functionality to the schemas, overriding toJSON method
    const { __v, estado, ...data  } = this.toObject(); // "this" only works in "normal" functions, not in "arrow" functions
    // this.toObject returns the literal javascript object
    // Destructuring to take out __v and estado, outside the rest
    return data; // --> It won't return neither __v nor estado
}


module.exports = model( 'Categoria', CategoriaSchema );
