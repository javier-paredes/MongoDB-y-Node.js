const Mensaje = require('../models/mensajes')

class Mensajes {

    constructor() {
        this.crearEntidad()
    }

    async crearEntidad(primerMensaje) {
        try {
            return Mensaje.create(primerMensaje);
        } catch (error) {
            console.log(error);
        }
    }

    async guardar(mensaje) {
        try {

            return resultado;
        } catch (error) {
            throw error;
        }
    }

    async devolver() {
        try {

            return mensajes;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new Mensajes();