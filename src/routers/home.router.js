const { Router } = require('express')
const express = require('express');
const router = Router()
const app = express();

const ProductManager = require(`${__dirname}/../productManager`);

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager(`${__dirname}/../products.json`);

router.get('/', async (_, res) => {
    try {
        const products = await productManager.getProducts();
        const prodcutsData = products.map(p=>({
            title: p.title,
            description: p.description,
            thumbnail: p.thumbnail,
            price: p.price,
            stock: p.stock,
            code: p.stock,
        }))
        res.render("home" ,{
            products : prodcutsData,
            titleHead:"Productos",
    }) 
    } catch (error) {
        res.status(404).json({ status:"succes", messege:"Products not found" });
    }
})
module.exports = router