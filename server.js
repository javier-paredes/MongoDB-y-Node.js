const express = require('express');
const productos = require('./api/productos');
const Mensajes = require('./api/mensajes')
const handlebars = require('express-handlebars')
const app = express();
const http = require('http');
const server = http.Server(app);
const io = require('socket.io')(server);

//CONECTAR CON MONGOOSE A LA DB DE MONGO
require('./database/connection');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ARCHIVOS ESTÁTICOS
app.use(express.static('public'));

//CONFIGURAR HANDLEBARS
app.engine('hbs', handlebars({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts'
}));

// ESTABLECER MOTOR DE PLANTILLAS
app.set("view engine", "hbs");
// DIRECTORIO ARCHIVOS PLANTILLAS
app.set("views", "./views");

// CREAR ROUTER
const routerProductos = express.Router()
const routerMensajes = express.Router()

// USAR ROUTERS
app.use('/api/productos', routerProductos)
app.use('/api/mensajes', routerMensajes)

// LISTAR TODOS LOS MENSAJES
routerMensajes.get('/leer', async (req, res) => {
    try {
        let result = await Mensajes.devolver();
        return res.json(result);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

// LISTAR MENSAJES POR ID
routerMensajes.get('/leer/:id', async (req, res) => {
    try {
        let result = await Mensajes.buscarPorId(req.params.id);
        return res.json(result);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

// GUARDAR MENSAJES EN DB
routerMensajes.post('/guardar', async (req, res) => {
    try {
        let result = await Mensajes.guardar(req.body);
        return res.json(result);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

// ACTUALIZAR UN MENSAJE
routerMensajes.put('/actualizar/:id', async (req, res) => {
    try {
        let result = await Mensajes.actualizar(req.params.id, req.body);
        return res.json(result);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

// BORRAR UN MENSAJE
routerMensajes.delete('/borrar/:id', async (req, res) => {
    try {
        let result = await Mensajes.borrar(req.params.id);
        return res.json(result);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

// LISTAR PRODUCTOS
routerProductos.get('/listar', async (req, res) => {
    try {
        let result = await productos.listar()
        return res.json(result);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }

    // if (productos.listar().length > 0) {
    //     res.render('vista', { hayProductos: true, productos: productos.listar() })
    // } else if (productos.listar().length == 0) {
    //     res.render('vista', { hayProductos: false })
    // }
})

// LISTAR PRODUCTOS POR ID
routerProductos.get('/listar/:id', async (req, res) => {

    try {
        let mensajeLista = await productos.listarPorId(req.params.id);
        res.json(mensajeLista)
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
})


// GUARDAR PRODUCTO
routerProductos.post('/guardar', async (req, res) => {
    try {
        let nuevoProducto = {};
        nuevoProducto.title = req.body.title;
        nuevoProducto.price = req.body.price;
        nuevoProducto.thumbnail = req.body.thumbnail;
        await productos.guardar(nuevoProducto)
        res.json(nuevoProducto)
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
    // if (productos.listar().length > 0) {
    //     res.render('vista', { hayProductos: true, productos: productos.listar() })
    // } else if (productos.listar().length == 0) {
    //     res.render('vista', { hayProductos: false })
    // }
})

//ACTUALIZAR PRODUCTO POR ID
routerProductos.put('/actualizar/:id', async (req, res) => {
    try {
        let nuevoProducto = await productos.actualizar(req.params.id, req.body);
        res.json(nuevoProducto);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
})

// BORRAR PRODUCTO POR ID
routerProductos.delete('/borrar/:id', async (req, res) => {
    let productoBorrado = await productos.borrar(req.params.id);
    return res.json(productoBorrado);
})

// DATOS CHAT

const messages = [
    { autor: 'Juan', texto: '¡Hola! ¿Que tal?' },
    { autor: 'Pedro', texto: '¡Muy bien! ¿Y vos?' },
    { autor: 'Ana', texto: '¡Genial!' }
];

// SE EJECUTA AL REALIZAR LA PRIMERA CONEXION
io.on('connection', async socket => {
    console.log('Usuario conectado')

    // GUARDAR PRODUCTO
    socket.on('nuevo-producto', nuevoProducto => {
        console.log(nuevoProducto)
        productos.guardar(nuevoProducto)
    })
    // VERIFICAR QUE SE AGREGA UN PRODUCTO
    socket.emit('guardar-productos', () => {
        socket.on('notificacion', data => {
            console.log(data)
        })
    })
    // ACTUALIZAR TABLA
    socket.emit('actualizar-tabla', productos.listar())

    // GUARDAR Y MANDAR MENSAJES QUE LLEGUEN DEL CLIENTE
    socket.on("new-message", function (data) {
        Mensajes.guardar(data)
        messages.push(data);
        console.log(data)
        io.sockets.emit("messages", Mensajes.devolver());
    });

});

// pongo a escuchar el servidor en el puerto indicado
const puerto = 8080;

// USO server PARA EL LISTEN
const svr = server.listen(puerto, () => {
    console.log(`servidor escuchando en http://localhost:${puerto}`);
});


// en caso de error, avisar
server.on('error', error => {
    console.log('error en el servidor:', error);
});
