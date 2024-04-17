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
        
        let options = { limit: limit, page: parseInt(page), lean: true, sort: { price: -1 } };
        
        const products = await ProductModel.paginate(filter, options);
        
        res.render('home', {
            titleHead: "Productos",
            products: products,
            styles: ["styles.css"]
        })
        
    } catch (error) {
        res.status(404).json({ status:"succes", messege:"Products not found" });
    }
})

module.exports = router