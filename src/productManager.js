const { promises: fs } = require('fs');


class ProductManager {
    constructor(path) {
        this.path = path;
    }
    async getProducts() {
        try {
            await fs.access(this.path);
        } catch (error) {
            return [];
        }
        try {
            const content = await fs.readFile(this.path, "utf-8");
            return JSON.parse(content);
        } catch (error) {
            return [];
        }
    } 
    async saveProductsToFile(products) {
        const content = JSON.stringify(products, null, "\t"); 
        try {
             await fs.writeFile(this.path, content, "utf-8");
        } catch (error) {
            throw new Error(`El archivo ${this.path} no pudo ser escrito.`);
        }
    }
    async #generateId() {
        const products = await this.getProducts()
        let id;
        do {
            id = Math.floor(Math.random() * 1000000);
        } while (products.some(p => p.id === id));
        return id;
    }
    async addProduct(prod) {
        const {title, description, price, thumbnail, code, stock} = prod
        const products = await this.getProducts()   
        if (!title || !description || !price || !code || !stock) {
            throw new Error('Todos los campos son obligatorios.');
        }
        if (price <= 0 || price === undefined ) {
            throw new Error('El precio debe ser un numero positivo');
        }
        if (stock < 0 || stock === undefined ) {
            throw new Error('El stock no debe ser un numero negativo');
        }
        if (products.some(p => p.code === code)) {
            throw new Error(`El producto con el codigo ${code} ya existe`);
        } else {
            const id = await this.#generateId();
            const product = { id, title, description, price, thumbnail, code, stock,status:true };
            products.push(product);
            await this.saveProductsToFile(products);
            return product
        }
    }
    async addCart(){
       const carts = await this.getProducts()
       const id = await this.#generateId();
       const newCart =  { id, products:[]}
       carts.push(newCart)
       await this.saveProductsToFile(carts);
       return newCart
    }
    async addProductInCart(cartId,productId){
        const cart = await this.getProducts()
        const cartIndex = cart.findIndex(cart => cart.id === cartId);
        if (cartIndex === -1) {
            throw new Error('Cart not found');
        } 
        const existingProdIndex = cart[cartIndex].products.findIndex(p => p.productId === productId);
        if (existingProdIndex !== -1) {
            cart[cartIndex].products[existingProdIndex].quantity ++;
            await this.saveProductsToFile(cart);
            return cart[cartIndex]
        } else {
            const newProduct = {
                productId,
                quantity: 1
            };
            cart[cartIndex].products.push(newProduct);
        }
        await this.saveProductsToFile(cart);
        return cart[cartIndex]
    }

    async getProdcutById(id) {
        const products = await this.getProducts();
        const product = products.find(p => p.id === id);
        if (!product) {
            throw new Error(`getProdcutById: Product not found ${product}`);
        } else {
            return product
        }
    }
    
    async updateProduct(id, prod) {
        const {title, stock} = prod
        const getProducts = await this.getProducts();
        if  (!title || !stock) {
            throw new Error('Todos los campos son obligatorios.');
        }
        if (stock < 0 || stock === undefined ) {
            throw new Error('El stock no debe ser negativo');
        }
        let index = getProducts.findIndex(p => p.id === id)
        if (!index) {
            throw new Error(`updateProduct: Product not foun, id: ${id}`);
        } else {
            getProducts[index] = {
                ...getProducts[index],
                title,
                stock,
                status: true,
                id: id
            };
            await this.saveProductsToFile(getProducts);
            console.log("Producto actualizado correctamente", getProducts[index])
            return getProducts[index]
        }
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const index = products.findIndex((p) => p.id === parseInt(id));
        if (index !== -1) {
            products.splice(index, 1);
            await this.saveProductsToFile(products);
            console.log(`Se ha borrado correctamente el producto ${id}`);
        } else {
            console.log(`No se ha podido borrado correctamente el producto ${id}`);
        }
    }

   
}
module.exports = ProductManager
