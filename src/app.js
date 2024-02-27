const express = require('express');
const ProductManager = require('./productManager');
const app = express();
app.use(express.urlencoded({ extended: true }));
const productManager = new ProductManager("./products.json");

app.get('/products', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        const { limit } = req.query;
        const isLimit = limit && (limit <= 5);
        if (isLimit) {
            prod = products.slice(6);
            res.json({ prod });
        } else {
            res.json({ products });
        }
    } catch (error) {
        res.json({ error: 'Error al traer los productos' });
    }
})

app.get('/products/:pid', async (req, res) => {
    try {
        const id = +req.params.pid;
        const getProdcutById = await productManager.getProdcutById(id);
        res.json({ getProdcutById });
    } catch (error) {
        res.json({ error: 'Error el producto no existe' });
    }
});

app.listen(8080, () => {
    console.log('Servidor escuchando en el puerto 8080.');
});


