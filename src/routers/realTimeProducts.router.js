const { Router } = require('express')
const router = Router()
const ProductModel = require('../dao/models/product.model')

router.get('/', async (req, res) => {
    try {
        let { limit, page, query } = req.query;
        
        page = parseInt(page);
        if (isNaN(page) || page < 1) {
            page = 1;
        }
        
        if (isNaN(limit) || limit <= 0) {
            limit = 10;
        }
        // Filtros por descripcion de prod o stock (disponibilidad)
        let filter = {};
        
        if (query === 'description') {
            filter.description = "Futbol"; 
        } else if (query === 'stock') {
            filter.stock = { $gt: 0 }; 
        } else {
            filter = {}; 
        }
        
        let options = { limit: limit, page: page, lean: true, sort: { price: -1 } };
        
        console.log(await ProductModel.paginate(filter, options))
        const products = await ProductModel.paginate(filter, options);
        res.render("realTimeProducts" ,{
            products : products,
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