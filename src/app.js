const productsRouter = require('./routers/products.router')
const cartsRouter = require('./routers/carts.router')
const viewsRouter = require('./routers/view.router')
const express = require('express');
const handlebars = require('express-handlebars')
const app = express();

app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use(express.static(`${__dirname}/../public`))

app.use('/api/products', productsRouter)
app.use("/api/carts",cartsRouter)
app.use("/api/views",viewsRouter)

app.listen(8080, () => {
    console.log('Servidor escuchando en el puerto 8080.');
});


