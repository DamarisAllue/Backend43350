import express from 'express'
import productRouter from './routers/products.routes.js'
import cartRouter from './routers/carts.routes.js'
import multer from 'multer'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./public'))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/public')
    },
    filename: (req, file,cb) => {
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