const { Router } = require('express')
const router = Router()

router.get('/', async (req, res) => {
    try {
        const productManager = req.app.get('productManager')
        const products = await productManager.getProducts();
        const prodcutsData = products.map(p=>({
            id:p.id,
            title: p.title,
            description: p.description,
            thumbnail: p.thumbnail,
            price: p.price,
            stock: p.stock,
            code: p.code,
        }))
        res.render("realTimeProducts" ,{
            products : prodcutsData,
            titleHead:"Productos",
            scripts:["realTimeProducts.js"] ,
            styles:["styles.css"],
            useWS: true
    }) 
    } catch (error) {
        res.status(404).json({ status:"succes", messege:"Products not found" });
    }
})
router.post('/',async(req, res) => {
    try {
        const productManager = req.app.get('productManager')
        const addProd = req.body
        await productManager.addProduct(addProd)
        req.app.get('ws').emit('newProduct', addProd)
        res.status(202).redirect("/api/realTimeProducts");    
    } catch (error) {
        res.status(404).json({ status:"succes", messege:"Product could not be added"});
    }
})

router.delete('/:pid', async(req, res)=>{
    try {
        const productManager = req.app.get('productManager')
        const id = req.params.pid;
        await productManager.deleteById(id);
        const products = await productManager.getProducts();
        req.app.get("ws").emit('updateProducts', products)
        res.status(202).redirect("/api/realTimeProducts");
    } catch (error) {
        res.status(400).json({status:"error", messege:"The product could not be deleted" });
    }
} )



module.exports = router