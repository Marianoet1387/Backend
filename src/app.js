const productsRouter = require('./routers/products.router')
const cartsRouter = require('./routers/carts.router')
const viewsRouter = require('./routers/view.router')
const express = require('express');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
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

const httpServer = app.listen(8080, () => {
    console.log('Servidor escuchando en el puerto 8080.');
});
const wsServer= new Server(httpServer)
app.set("ws", wsServer)

wsServer.on("connection", (socket)=>{
    console.log("Nuevo cliente conectado via ws")

})


