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
const chatRouter = require('./routers/views.router')
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
app.use("/api/chat", chatRouter)

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

    wsServer.on("connection", async (socket) => {
        console.log(`Nuevo cliente conectado: ${socket.id}`)
        // Recuperar todos los mensajes de la base de datos
        try {
            const messages = await productManager.getMessage()
            // Enviar los mensajes al cliente recién conectado
            messages.forEach(message => {
                socket.emit("message", { username: message.username, message: message.message });
            });
        } catch (error) {
            console.error("Error al recuperar los mensajes de la base de datos:", error);
        }

        socket.on("message", async (data) => {
            const { username, message } = data;
            // Guardar el mensaje en la base de datos
            try {
                await productManager.saveMessage(username,message)
            } catch (error) {
                console.error("Error al guardar el mensaje en la base de datos:", error);
            }
            // Emitir el mensaje a todos los clientes conectados
            wsServer.emit("message", data);
        });

        socket.on("user-connected", (username) => {
            // Notificar a los otros usuarios que se conectó un usuario
            socket.broadcast.emit("user-joined-chat", username);
        });
    })
}
main()
