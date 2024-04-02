const ProductModel = require('../models/product.model')
const CartModel = require("../models/cart.model")
const MessageModel = require("../models/message.model")
class ProductManager {
    constructor() { }

    async prepare() {
        if (ProductModel.db.readyState !== 1) {
            throw new error("must connect  to mongoose")
        }
    }

    async getProducts() {
        const products = await ProductModel.find()
        return products.map(u => u.toObject({ virtuals: true }))
    }

    async addProduct(prod) {
        const { title, description, price, thumbnail, code, stock } = prod
        const invalidPriceStock = (isNaN(+price) || price <= 0 || isNaN(+stock) || stock <= 0)
        if (!title || !description || !price || !code || !stock || invalidPriceStock) {
            throw new Error('Todos los campos son obligatorios y/o las variables deben ser numericas positivas');
        }
        if (!thumbnail) {
            thumbnail = "Sin imagen";
        }
        await ProductModel.create({
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        })
    }

    async deleteById(id) {
        return ProductModel.deleteOne({ _id: id })
    }

    async getCartById(id) {
        try {
            const cart = await CartModel.findById(id);
            if (!cart) {
                throw new Error("No se encontró un carrito con el ID proporcionado");
            }
            return cart.toObject({ virtuals: true });
        } catch (error) {
            throw error;
        }
    }

    async addCart() {
        await CartModel.create({ products: [] })

    }
    
    async addProductInCart(cartId, prodId) {
        const cart = await CartModel.findById(cartId);
        if (!cart) {
            newCart = await CartModel.create({
                products: [{ prodId, quantity: 1 }]
            });
        } else {
            const existingProduct = cart.products.find(p => p.prodId === prodId);
            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.products.push({ prodId, quantity: 1 });
            }
            await cart.save();
        }
        return cart.toObject({ virtuals: true });
    }

    async getMessage(){
        return await MessageModel.find()
    }
    async saveMessage(username,message){
        return await MessageModel.create({username, message})
    } 
}
module.exports = ProductManager
