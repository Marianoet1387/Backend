const { Router } = require('express')
const router = Router()

router.post("/", async (req, res) => {
    try {
        const cartManager = req.app.get('productManager')
        const newCart = await cartManager.addCart(req.params)
        res.status(202).json({status:"succes", messege:"Added products",newCart});
    } catch (error) {
        res.status(400).json({ status: "error", messege: "Carts could not be added" });
    }
})

router.get("/:cid", async (req, res) => {
    try {
        const cartManager = req.app.get('productManager')
        const id = req.params.cid
        const getCartById = await cartManager.getCartById(id);
        data = {
            ...getCartById
        }
        res.status(202).json({status:"succes", messege:"Products found", data});
    } catch (error) {
        res.status(404).json({ status: "error", messege: "Products not found" });
    }
})
router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cartManager = req.app.get('productManager')
        const cartId = req.params.cid
        const productId = req.params.pid
        const addedProdCart = await cartManager.addProductInCart(cartId,productId)
        res.status(200).json({ message: 'Product added to cart successfully',addedProdCart });
    } catch (error) {
        res.status(404).json({ status: "error", messege: "Products not found" });
    }

})
router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const cartManager = req.app.get('productManager')
        const cartId = req.params.cid
        const productId = req.params.pid
        const { quantity } = req.body;
        const addedProdCart = await cartManager.updateProdByCart(cartId,productId,quantity)
        res.status(200).json({ message: 'Product updated successfully',addedProdCart });
    } catch (error) {
        res.status(404).json({ status: "error", messege: "Products not found" });
    }

})

router.delete('/:cid/products/:pid', async(req, res)=>{
    try {
        const productManager = req.app.get('productManager')
        const cartId = req.params.cid
        const productId = req.params.pid
        await productManager.deleteOneProdCart(cartId,productId)
        const products = await productManager.getProducts();
        req.app.get("ws").emit('updateProducts', products)
        res.status(202).redirect("/api/realTimeProducts");
    } catch (error) {
        res.status(400).json({status:"error", messege:"The product could not be deleted" });
    }
} )

router.delete('/:cid', async(req, res)=>{
    try {
        const productManager = req.app.get('productManager')
        const cartId = req.params.cid
        await productManager.deleteProdCart(cartId)
        const products = await productManager.getProducts();
        req.app.get("ws").emit('updateProducts', products)
        res.status(202).redirect("/api/realTimeProducts");
    } catch (error) {
        res.status(400).json({status:"error", messege:"The product could not be deleted" });
    }
} )


module.exports = router
