import fs from "fs";

const filename = "./data/products.json";

class ProductManager {
    #path;
    #products;
    constructor() {
        this.#products = [];
        this.#path = "./src/data/products.json";
    }

    addProduct = async (product) => {
        let { title, description, price, thumbnail, code, stock } = product;
        if (!title || !description || !price || !code || !stock) {
            return "406a";
        }
        let id = this.#generateId();
        let producto = { id, ...product, status: true };
        if (!thumbnail) {
            producto = { ...producto, thumbnail: [] };
        }
        await this.#saveFile(producto);
        return 201;
    };

    #saveFile = async (product) => {
        if (!fs.existsSync(this.#path)) {
            fs.writeFileSync(this.#path, JSON.stringify([], null, "\t"));
        }
        const data = await this.getProducts();
        if (data.find((item) => item.code === product.code)) {
            return "406b";
        }
        data.push(product);
        fs.writeFileSync(this.#path, JSON.stringify(data, null, "\t"));
    };

    #generateId = () => {
        if (!fs.existsSync(this.#path)) return 1;
        this.#products = JSON.parse(fs.readFileSync(this.#path, "utf-8"));
        let id = this.#products[this.#products.length - 1].id + 1;
        return id;
    };

    getProducts = async () => {
        if (!fs.existsSync(this.#path)) {
            return [];
        } else {
            const data = await fs.promises.readFile(this.#path, "utf-8");
            if (data) {
                const products = JSON.parse(data);
                return products;
            }
        }
    };

    getProductById = async (id) => {
        if (!fs.existsSync(this.#path)) {
            return "406a";
        }
        const products = await this.getProducts();
        let resultadoBusqueda = products.filter((item) => item.id === id);
        if (resultadoBusqueda.length === 0) {
            return "406b";
        }
        return resultadoBusqueda[0];
    };

    updateProduct = async (id, mods) => {
        const data = await this.getProducts();
        if (!data.find((item) => item.id === id)) {
            return 406;
        }
        for (let i = 0; i < data.length; i++) {
            if (data[i].id === id) {
                data[i] = { ...data[i], ...mods };
                fs.writeFileSync(this.#path, JSON.stringify(data, null, "\t"));
            }
        }
    };

    deleteProduct = async (id) => {
        const data = await this.getProducts();
        if (!data.find((item) => item.id === id)) {
            return 406;
        }
        for (let i = 0; i < data.length; i++) {
            if (data[i].id === id) {
                data.splice(i, 1);
            }
        }
        fs.writeFileSync(this.#path, JSON.stringify(data, null, "\t"));
    };
}

const manager = new ProductManager();

export { manager, ProductManager };

/* import fs from 'fs'

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

export default ProductManager; */


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