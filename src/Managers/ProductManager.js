import fs from 'fs'

class ProductManager {
    constructor() {
        this.path = 'products.json'
    }

    async generateId(){
        let products = await this.getProducts()
        return products.length + 1
    }

    async addProduct(product){
        let products = await this.getProducts()
        products.push(product)
        await fs.promises.writeFile(this.path, JSON.stringify(products))
    }
    
    async getProducts(){
        let data = await fs.promises.readFile(this.path)
        let products = JSON.parse(data)
        return products
    }

    async getProductByid(id){
        let products = await this.getProducts()
        let idProduct = products.find(product => product.id == id);
        return idProduct
    }

    async updateProduct(id, product){
        let products = await this.getProducts()
        let indice = products.findIndex(product => product.id == id)
            if (indice !== -1) {
                products[indice].title = product.title
                products[indice].description = product.description
                products[indice].price = product.price
                products[indice].code = product.code
                products[indice].stock = product.stock
            } else{
                return null;
            }
        await fs.promises.writeFile(this.path, JSON.stringify(products))
        return product;
    }

    async deleteProduct(id){
        let products = await this.getProducts()
        let indice = products.findIndex(product => product.id == id)
        if (indice !== -1) {
            products.splice(indice, 1)
        } else {
            return null;
        }
        await fs.promises.writeFile(this.path, JSON.stringify(products))
        return products;
    }

}

export default ProductManager;


/* import fs from 'fs';

class ProductManager {
    constructor() {
        this.path = 'src/products.json';
        this.currentId = 1;

        this.getProducts().then((productos) => {
            if (productos.length > 0) {
                this.currentId = productos[productos.length - 1].id + 1;
            }
        });
    }

    async addProduct(product) {
        let productos = await this.getProducts()
        const requiredFields = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];

        // Validar que todos los campos requeridos estén presentes
        for (const field of requiredFields) {
            if (!product[field]) {
                console.error(`El campo ${field} es obligatorio`);
                return;
            }
        }

        // Validar que no se repita el código del producto
        const existingProduct = productos.find((p) => p.code === product.code);
        if (existingProduct) {
            console.error(`El producto con el código ${product.code} ya existe`);
            return;
        }

        // Agregar el producto al arreglo y asignarle un id autoincrementable
        const newProduct = { ...product, id: this.currentId };
        productos.push(newProduct);
        this.currentId++;
        await fs.promises.writeFile(this.path, JSON.stringify(productos))

        console.log('Producto agregado:', newProduct);
    }

    async getProducts() {
        let archivo = await fs.promises.readFile(this.path)
        let productos = JSON.parse(archivo)
        return productos
    }

    async getProductById(id) {
        let productos = await this.getProducts()
        let productoEncontrado = productos.find(producto => producto.id == id)
        return productoEncontrado ? productoEncontrado : "No encontrado";
    }

    async updateProduct(id, updatedProduct) {
        let productos = await this.getProducts()
        let index = productos.findIndex(producto => producto.id == id)
        if (index == -1) {
            console.error(`El producto con el id ${id} no existe`)
            return
        }
        productos[index] = { ...productos[index], ...updatedProduct }
        await fs.promises.writeFile(this.path, JSON.stringify(productos))
        console.log(`Producto con el id ${id} actualizado`)
    }

    async deleteProduct(id) {
        let productos = await this.getProducts()
        let index = productos.findIndex(producto => producto.id == id)
        if (index == -1) {
            console.error(`El producto con el id ${id} no existe`)
            return
        }
        productos.splice(index, 1)
        await fs.promises.writeFile(this.path, JSON.stringify(productos))
        console.log(`Producto con el id ${id} eliminado`)
    }
}

export default ProductManager */