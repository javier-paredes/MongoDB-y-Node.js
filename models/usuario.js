const mongoose = require('mongoose');

const schema = mongoose.Schema({
    title: { type: String, required: true, max: 100 },
    price: { type: Number, required: true, max: 100 },
    thumbnail: { type: String, required: true, max: 100 },
    id: { type: Number, required: true, max: 100 },
});

const Producto = mongoose.model('productos', schema);

module.exports = Producto;