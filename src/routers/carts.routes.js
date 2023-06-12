import { Router } from 'express'
import { cartManager } from "../controllers/CartManager.js"

const router = Router()

router.post("/", async (req, res) => {
    try {
        const addCart = await cartManager.addCart()
        res.json({ message: "Producto agregado al carrito", addCart })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Error en el servidor" })
    }
})

router.get("/:cid", async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid) 
        const cart = await cartManager.getCartsById(cartId)
        if (!cart) {
            return res.status(404).json({ error: `El carrito con id ${cartId} no existe` })
        } 
        res.json(cart)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Error en el servidor" })
    }
})


router.post("/:cid/products/:pid", async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid)
        const productId = parseInt(req.params.pid)
        if (productId <= 0) {
            return res.status(404).json({ error: "Producto no válido" })
        }
        const cart = await cartManager.addProductsToCart(cartId, productId)
        if (!cart) {
            return res.status(404).json({ error: `El carrito con el id ${cartId} no existe` })
        }
        res.json(cart)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Error en el servidor" })
    }
})

export default router