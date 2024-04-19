const ProductModel = require('../models/product.model')
const CartModel = require("../models/cart.model")

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

    // Carts
    
    async addCart() {
            await CartModel.create({ products: [] })
    }
   
    async getCartById(cartId) {
        const cart = await CartModel.findById(cartId).populate('products.prodId');
        if (!cart) {
            throw new Error("No se encontró un carrito con el ID proporcionado");
        }
        return cart.toObject({ virtuals: true });
    }

    async addProductInCart(cartId, prodId) {
        const cart = await CartModel.findById(cartId);
        if (!cart) {
            newCart = await CartModel.create({
                products: [{ prodId, quantity: 1 }]
            });
        } else {
            const stringProdId = prodId.toString(); // Convertir ObjectId a cadena para comparación
            const existingProduct = cart.products.find(p => p.prodId.toString() === stringProdId);
            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.products.push({ prodId, quantity: 1 });
            }
            await cart.save();
            return cart.toObject({ virtuals: true });
        }
        return cart.toObject({ virtuals: true });
    }

    async updateProdByCart(cartId,prodId,quantity){
        const cart = await CartModel.findById(cartId);
        if (!cart) {
            throw new Error("No se encontró un carrito con el ID proporcionado");
        }
        const productIndex = cart.products.findIndex(p => p.prodId === prodId);
        if (productIndex === -1) {
            throw new Error("El producto no está en el carrito");
        }
        // Actualizar la cantidad de ejemplares del producto en el carrito
        cart.products[productIndex].quantity = quantity;
        // Guardar el carrito actualizado en la base de datos
        await cart.save();
    }

    async deleteOneProdCart(cartId, prodId) {
        const cart = await CartModel.findById(cartId);
        if (!cart) {
            throw new Error("No se encontró un carrito con el ID proporcionado");
        }
        cart.toObject({ virtuals: true });
        const index = cart.products.findIndex(p => p.prodId === prodId);
        if (index !== -1) {
            cart.products.splice(index, 1);
            await cart.save();
        }
    }

    async deleteProdCart(cartId) {
        const cart = await CartModel.findById(cartId);
        if (!cart) {
            throw new Error("No se encontró un carrito con el ID proporcionado");
        }
        
        const productIds = cart.products.map(p => p.prodId);
        await ProductModel.deleteMany({ _id: { $in: productIds } });
        cart.products = [];
        await cart.save();
    }
}
module.exports = ProductManager
