const productsRouter = require('./routers/products.router')
const cartsRouter = require('./routers/carts.router')
const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use('/api/products', productsRouter)
app.use("/api/carts",cartsRouter)

app.listen(8080, () => {
    console.log('Servidor escuchando en el puerto 8080.');
});


