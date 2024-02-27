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
   
    async addProduct(title, description, price, thumbnail, code, stock) {
        const products = await this.getProducts()
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error('Todos los campos son obligatorios.');
        }
        if (price <= 0 || undefined ) {
            throw new Error('El precio debe ser un numero positivo');
        }
        if (stock < 0 || undefined ) {
            throw new Error('El stock no debe ser un numero negativo');
        }
        if (products.some(p => p.code === code)) {
            throw new Error(`El producto con el codigo ${code} ya existe`);
        } else {
            const id = await this.#generateId();
            const product = { id, title, description, price, thumbnail, code, stock };
            products.push(product);
            await this.saveProductsToFile(products);
        }
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
    
    async updateProduct(id, newTitle, newDescription, newPrice, newThumbnail, newCode, newStock) {
        const getProducts = await this.getProducts();
        if (!newTitle || !newDescription || !newPrice || !newThumbnail || !newCode || !newStock) {
            throw new Error('Todos los campos son obligatorios.');
        }
        if (newPrice <= 0 || undefined ) {
            throw new Error('El precio debe ser positivo');
        }
        if (newStock < 0 || undefined ) {
            throw new Error('El stock no debe ser negativo');
        }
        let ProdId = getProducts.some(p => p.id === id)
        if (!ProdId) {
            throw new Error(`updateProduct: Product not foun, id: ${id}`);
        } else {
            const products = { id: id, title: newTitle, description: newDescription, price: newPrice, thumbnail: newThumbnail, code: newCode, stock: newStock }
            await this.saveProductsToFile(products);
            console.log("Producto actualizado correctamente", products)
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
/*
const test = async () => {
    //const productManager = new ProductManager("./products.json");

    //console.log("getProdcuts ",await productManager.getProducts());

    //await productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "sin imagen", "abc123", 25)

    //console.log(await productManager.getProducts());

    //await productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "sin imagen", "abc123", 25)

    //await productManager.getProdcutById(79794);

    //await productManager.updateProduct(1, "actualizado", "actualizado", 200, "sin imagen", "abc123", 25)
    
    //await productManager.deleteProduct(1);

    //console.log("getProdcuts",await productManager.getProducts());
}
test()
*/


