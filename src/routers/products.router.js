const { Router } = require('express')
const router = Router()

router.get('/', async (req, res) => {
    try {
        const productManager = req.app.get('productManager')
        const products = await productManager.getProducts();
        const { limit } = req.query;
        const isLimit = Number(limit);
        const condition = (isNaN(isLimit) || !isLimit || isLimit <= 0)
        if (condition) {
            res.status(200).json({ status:"succes", messege:"All the products",products});
        } else {
            prod = products.slice(0,isLimit);
            res.status(200).json({ status:"succes", messege:"Products found",prod});
        }
    } catch (error) {
        res.status(404).json({ status:"succes", messege:"Products not found" });
    }
})

router.get('/:pid', async (req, res) => {
    try {
        const productManager = req.app.get('productManager')
        const id = +req.params.pid;
        const getProdcutById = await productManager.getProdcutById(id); 
        res.status(202).json({ status:"succes", messege:"Products found", getProdcutById });
    } catch (error) {
        res.status(400).json({status:"error", messege:"User not found" });
    }
});

router.post('/',async(req, res)=> {
    try {
        const productManager = req.app.get('productManager')
        const addProd = req.body
        const newProduct = await productManager.addProduct(addProd)
        res.status(200).json(newProduct)
    } catch (error) {
        res.status(400).json({status:"error", messege:"Product could not be added" });
    }
} )
router.put('/:pid',async(req, res)=> {
    try {
        const productManager = req.app.get('productManager')
        const pid = +req.params.pid;
        const newProd = req.body;
        const updatedProd = await productManager.updateProduct(pid, newProd);
        res.status(202).json({ status:"succes", messege:"Updated product",updatedProd});
    } catch (error) {
        res.status(400).json({status:"error", messege:"The product could not be updated" });
    }
})
router.delete('/:pid', async(req, res)=>{
    try {
        const id = +req.params.pid;
        await productManager.deleteProduct(id);
        res.status(202).json({ status:"succes", messege:"Product disposed correctly" });
    } catch (error) {
        res.status(400).json({status:"error", messege:"The product could not be deleted" });
    }
} )

module.exports = router