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
module.exports = router
