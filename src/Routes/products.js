import { Router } from "express";
import ProductManager from "../Managers/ProductManager.js";
import { validate } from "../Utils/index.js";

const ProductsRouter = Router();

let manager = new ProductManager();

ProductsRouter.get("/", async (req, res) => {
    const limit = req.query.limit; // obtener el valor del query parameter limit
    const products = await manager.getProducts();
    if (limit) {
        res.send(products.slice(0, limit)); // devolver solo los primeros "limit" productos
    } else {
        res.send(products); // devolver todos los productos
    }
});

ProductsRouter.get("/:pid", async (req, res) => {
    const productId = req.params.pid; // obtener el id del producto solicitado
    const product = await manager.getProductById(productId);
    if (!product) {
        res.status(400).send({ status: "error", msg: "Producto no encontrado." })
    }
    res.send(product); // devolver el producto solicitado
});

ProductsRouter.post("/", async (req, res) => {
    let product = req.body;
    product.id = await manager.generateId();
    product.status = true
    if (!validate(product)) {
        res.status(400).send({ status: "error", msg: "Invalid Product" })
    }
    await manager.addProduct(product);
    res.send({ status: "success", msg: "Added Product" })
});

ProductsRouter.put("/:pid", async (req, res) => {
    let pid = req.params.pid;
    let newProduct = req.body;
    let productUpdate = await manager.updateProduct(pid, newProduct);
    if (!productUpdate) {
        res.status(400).send({ status: "error", msg: "Product cannot be updated!" })
    }
    res.send({ status: "success", msg: "Updated Product" })
})

ProductsRouter.delete("/:pid", async (req, res) => {
    let pid = req.params.pid;
    let productDelete = await manager.deleteProduct(pid);
    if (!productDelete) {
        res.status(400).send({ status: "error", msg: "Product cannot be deleted!" })
    }
    res.send({ status: "success", msg: "Product deleted" })
})
export default ProductsRouter;