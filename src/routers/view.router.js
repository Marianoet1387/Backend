const { Router } = require('express')
const express = require('express');
const {Server} = require("socket.io")
const ProductManager = require(`${__dirname}/../productManager`);
const router = Router()
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager(`${__dirname}/../products.json`);

router.get('/', async (_, res) => {
    try {
        const products = await productManager.getProducts();
        console.log(products)
        res.render("home" ,products) 
    } catch (error) {
        throw error
        res.status(404).json({ status:"succes", messege:"Products not found" });
    }
})

module.exports = router