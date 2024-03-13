const { Router } = require('express')
const router = Router()
const express = require('express');
const ProductManager = require(`${__dirname}/../productManager`); 
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const cartManager = new ProductManager(`${__dirname}/../cart.json`);
const productManager = new ProductManager(`${__dirname}/../products.json`)

router.post("/", async (req, res) => {
    try {
        const addCart = req.params
        const newCart = await cartManager.addCart(addCart)
        res.status(200).json(newCart)
        //res.status(202).json({status:"succes", messege:"Added products"});
    } catch (error) {
        res.status(400).json({ status: "error", messege: "Carts could not be added" });
    }
})

router.get("/:cid", async (req, res) => {
    try {
        const id = +req.params.cid
        const getCartById = await cartManager.getProdcutById(id);
        data = {
            ...getCartById
        }
        res.status(202).json(data)
        //res.status(202).json({status:"succes", messege:""});
    } catch (error) {
        res.status(404).json({ status: "error", messege: "Products not found" });
    }
})
router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = +req.params.cid
        const productId = +req.params.pid
        const addProdCart = await cartManager.addProductInCart(cartId,productId)
        res.status(200).json({ message: 'Product added to cart successfully',addProdCart });
    } catch (error) {
        throw error
        res.status(404).json({ status: "error", messege: "Products not found" });
    }

})
module.exports = router
