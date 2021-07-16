const Mensaje = require('../models/mensajes')

class Mensajes {

    constructor() {

    }

    async devolver() {
        try {
            return Mensaje.find();
        } catch (error) {
            throw error;
        }
    }

    async buscarPorId(id) {
        try {
            return Mensaje.findById(id)
        } catch (error) {
            throw error;
        }
    }

    async guardar(mensaje) {
        try {
            return Mensaje.create(mensaje)
        } catch (error) {
            throw error;
        }
    }

    async actualizar(id, mensaje) {
        try {
            return Mensaje.findByIdAndUpdate(id, mensaje)
        } catch (error) {
            throw error;
        }
    }

    async borrar(id) {
        try {
            return Mensaje.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new Mensajes();