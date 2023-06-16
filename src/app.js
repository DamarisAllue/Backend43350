import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import productRouter from './routers/products.routes.js'
import cartRouter from './routers/carts.routes.js'
import multer from 'multer'
import __dirname, { PORT } from "./utils.js";
import viewsProductsRoutes from "./routers/views.routes.js";

const app = express()

app.use(express.json());

// Iniciar el servidor HTTP
const serverHttp = app.listen(PORT, () =>
    console.log(`Listening on port ${PORT}`)
);
// Crear una instancia de Socket.IO y vincularla al servidor HTTP
const io = new Server(serverHttp);

app.set("socketio", io);
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./public'))

// Configurar el motor de plantillas Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

// Ruta principal
app.get("/", (req, res) => res.render("index", { name: "Dami" }))
// Rutas para la API de productos y carritos
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
// Ruta para las vistas de productos
app.use("/home", viewsProductsRoutes);

// Evento de conexión de Socket.IO
io.on("connection", socket => {
    console.log("Successful Connection");
    // Escucha el evento "productList" emitido por el cliente
    socket.on("productList", data => {
        // Emitir el evento "updatedProducts" a todos los clientes conectados
        io.emit("updatedProducts", data);
    });
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/public')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const uploader = multer({ storage })

app.post('/', uploader.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ status: 'error', error: 'No se pudo cargar el archivo' })
    }
    res.json({ status: 'success', message: 'Archivo cargado correctamente' })
})

app.get('/', (req, res) => {
    res.json({ message: 'Server Ok' })
})

app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)

app.listen(8080, () => console.log('Server Up'))