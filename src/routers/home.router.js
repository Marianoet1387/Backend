const { Router } = require('express')
const router = Router()

router.get('/', async (req, res) => {
    try {
        const productManager = req.app.get('productManager')
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
            styles:["styles.css"]
    }) 
    } catch (error) {
        res.status(404).json({ status:"succes", messege:"Products not found" });
    }
})
module.exports = router