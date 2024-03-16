const { Router } = require('express')
const express = require('express');
const router = Router()

const ProductManager = require(`${__dirname}/../productManager`);
const app = express();

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
        res.render("realTimeProducts" ,{
            products : prodcutsData,
            titleHead:"Productos",
            scripts:["realTimeProducts.js"] ,
            useWS: true
    }) 
    } catch (error) {
        throw error
        res.status(404).json({ status:"succes", messege:"Products not found" });
    }
})
router.post('/',async(req, res) => {
    try {
        console.log(req.body)   
        const addProd = req.body
        const newProduct = await productManager.addProduct(addProd)

        req.app.get("ws").emit("newProduct", newProduct)

        res.json(newProduct)   
        
    } catch (error) {
        throw error
    }
})


module.exports = router