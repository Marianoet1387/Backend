const { Router } = require('express')
const router = Router()
const express = require('express');
const ProductManager = require(`${__dirname}/../productManager`);
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager(`${__dirname}/../products.json`);

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        const { limit } = req.query;
        const isLimit = Number(limit);
        const condition = (isNaN(isLimit) || !isLimit || isLimit <= 0)
        if (condition) {
            res.status(202).json(products) 
            //res.status(200).json({ status:"succes", messege:"All the products"});
        } else {
            prod = products.slice(0,isLimit);
            res.status(202).json(prod) 
            //res.status(200).json({ status:"succes", messege:"Products found"});
        }
    } catch (error) {
        res.status(404).json({ status:"succes", messege:"Products not found" });
    }
})

router.get('/:pid', async (req, res) => {
    try {
        const id = +req.params.pid;
        const getProdcutById = await productManager.getProdcutById(id);
        res.status(202).json(getProdcutById) 
        //res.status(202).json({ status:"succes", messege:"Products found" });
    } catch (error) {
        res.status(400).json({status:"error", messege:"User not found" });
    }
});

router.post('/',async(req, res)=> {
    try {
        const addProd = req.body
        const newProduct = await productManager.addProduct(addProd)
        res.status(200).json(newProduct)
    } catch (error) {
        res.status(400).json({status:"error", messege:"Product could not be added" });
    }
} )
router.put('/:pid',async(req, res)=> {
    try {
        const pid = +req.params.pid;
        const newProd = req.body;
        const updatedProd = await productManager.updateProduct(pid, newProd);
        res.status(200).json(updatedProd);
        //res.status(202).json({ status:"succes", messege:"Updated product"});
    } catch (error) {
        throw error
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