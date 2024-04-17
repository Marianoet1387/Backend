const express = require('express');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const mongoose = require("mongoose")

const FilesProductManager = require(`./dao/fileManagers/productManager`)
const DbProductManager = require(`./dao/dbManagers/productManager`)

const productsRouter = require('./routers/products.router')
const cartsRouter = require('./routers/carts.router')
const realTimeProductsRouter = require('./routers/realTimeProducts.router')
const homeRouter = require('./routers/home.router')

const app = express();

app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use(express.static(`${__dirname}/../public`))

app.use('/api/products', productsRouter)
app.use("/api/carts", cartsRouter)
app.use('/api/home', homeRouter)
app.use("/api/realTimeProducts", realTimeProductsRouter)

const main = async () => {

    await mongoose.connect("mongodb+srv://Coderuser:1234@testcoder.1ks6sid.mongodb.net/?retryWrites=true&w=majority&appName=TestCoder", {
        dbName: "ecommerce"
    })

    const productManager = new DbProductManager()
    await productManager.prepare()
    app.set('productManager', productManager)

    const httpServer = app.listen(8080, () => {
        console.log('Servidor escuchando en el puerto 8080.');
    });

    const wsServer = new Server(httpServer)
    app.set("ws", wsServer)

   
}
main()
