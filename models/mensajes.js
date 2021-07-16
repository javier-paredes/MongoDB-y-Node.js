const mongoose = require('mongoose');

const schema = mongoose.Schema({
    nombre: { type: String, required: true, max: 100 },
    fyh: { type: Date, default: Date.now() },
    mensaje: { type: String, required: true, max: 100 }
});

const Mensaje = mongoose.model('mensajes', schema);

module.exports = Mensaje;