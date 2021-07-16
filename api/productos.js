

class Productos {
    constructor() {
        this.producto = [];
        this.crearTabla();
    }

    async crearTabla() {
        try {
            console.log('Borrando tabla existente...');
            
            
            await knex.schema.createTable('productos', table => {
                table.string('title');
                table.integer('price');
                table.string('thumbnail');
                table.integer('id');
            });
            console.log('Tabla productos creada!');
        } catch (error) {
            console.log(error);
        }
    }

    listar() {
        
        return this.producto;
    }

    async guardar(productos) {
        try {
            
        }
        catch (error) {
            console.log(error);
        }

        this.producto.push(productos);
    }

    actualizar(idProducto, nuevoProducto) {
        this.producto[idProducto] = nuevoProducto;
       
            
    }

    borrar(idProducto) {
        console.log(idProducto)
        
        let productoBorrado = this.producto.splice(idProducto, 1);
        return productoBorrado;
    }
}

module.exports = new Productos();