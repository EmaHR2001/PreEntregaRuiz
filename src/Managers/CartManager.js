import fs from "fs";

const filename = "./data/carts.json";

class CartManager {
    #path;
    #carts;
    constructor() {
        this.#carts = [];
        this.#path = "./src/data/carts.json";
    }

    addCart = async () => {
        let id = this.#generateId();
        let cart = { id, products: [] };
        await this.#saveFile(cart);
        return 201;
    };

    #saveFile = async (cart) => {
        if (!fs.existsSync(this.#path)) {
            fs.writeFileSync(this.#path, JSON.stringify([], null, "\t"));
        }
        const data = await this.getCarts();
        data.push(cart);
        fs.writeFileSync(this.#path, JSON.stringify(data, null, "\t"));
    };

    #generateId = () => {
        if (!fs.existsSync(this.#path)) return 1;
        this.#carts = JSON.parse(fs.readFileSync(this.#path, "utf-8"));
        let id = this.#carts[this.#carts.length - 1].id + 1;
        return id;
    };

    getCarts = async () => {
        if (!fs.existsSync(this.#path)) {
            return [];
        } else {
            const data = await fs.promises.readFile(this.#path, "utf-8");
            if (data) {
                const carts = JSON.parse(data);
                return carts;
            }
        }
    };

    getCartById = async (id) => {
        if (!fs.existsSync(this.#path)) {
            return "406a";
        }
        const carts = await this.getCarts();
        let resultadoBusqueda = carts.filter((item) => item.id === id);
        if (resultadoBusqueda.length === 0) {
            return "406b";
        }
        return resultadoBusqueda[0];
    };

    addProduct = async (cid, pid) => {
        const product = { id: pid, quantity: 1 };
        const carts = await this.getCarts();
        carts.forEach((element) => {
            if (element.id === cid) {
                console.log(element);
                if (element.products.find((item) => item.id === pid)) {
                    element.products.forEach((item) => {
                        if (item.id === pid) {
                            item.quantity += 1;
                            fs.writeFileSync(this.#path, JSON.stringify(carts, null, "\t"));
                        }
                    });
                } else {
                    element.products = [...element.products, { id: pid, quantity: 1 }];
                    fs.writeFileSync(this.#path, JSON.stringify(carts, null, "\t"));
                }
            }
        });
    };
}

const manager = new CartManager();

export { manager, CartManager };

/* import fs from 'fs'

class CartManager {
    constructor() {
        this.path = 'cart.json'
    }

    async generateId(){
        let carts = await this.getCarts()
        return carts.length + 1
    }

    async getCarts(){
        let data = await fs.promises.readFile(this.path)
        let carts = JSON.parse(data)
        return carts;
    }

    async createCart(){
        let newCart = {
            id : await this.generateId(),
            products : []
        }
        let carts = await this.getCarts();
        carts.push(newCart);
        await fs.promises.writeFile(this.path, JSON.stringify(carts))
        return newCart;
    }

    async getProductsOfCart(id){
        let carts = await this.getCarts();
        let idCart = carts.find(cart => cart.id == id);
        return idCart;
    }

    async AddProductToCart(cid, pid){
        let cart;
        let carts = await this.getCarts();
        let index = carts.findIndex(cart => cart.id == cid);
        if (index === -1) {
            return cart;
        }
        let product = {
            id : parseInt(pid),
            quantity: 1
        }
        let cartProducts = carts[index].products;
        let ProductExist = cartProducts.find(cartProduct => cartProduct.id == product.id);
        if (ProductExist) {
            ProductExist.quantity++;
        } else {
            cartProducts.push(product);
        }
        await fs.promises.writeFile(this.path, JSON.stringify(carts));
        return carts[index];
    }
    

}

export default CartManager; */