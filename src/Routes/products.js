import { manager } from "../Managers/ProductManager.js";
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
    const limit = req.query.limit;
    const data = await manager.getProducts();
    if (data) {
        !limit
            ? res.send({ status: "success", paiload: data })
            : res.send({ status: "success", paiload: data.slice(0, limit) });
    } else {
        res.status(406).send({ status: "error", paiload: "No hay productos" });
    }
});

router.get("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);
    const data = await manager.getProductById(id);
    if (data == "406a") {
        res.status(406).send({ status: "error", paiload: "No hay productos" });
    } else if (data == "406b") {
        res.status(406).send({ status: "error", paiload: "No existe el producto" });
    } else {
        res.send({ status: "success", paiload: data });
    }
});

router.post("/", async (req, res) => {
    const product = req.body;
    if ("id" in product) {
        delete product.id;
    }
    const data = await manager.addProduct(product);
    if (data == "406b") {
        res.status(406).send({ status: "error", paiload: "El producto ya existe" });
    } else if (data == "406a") {
        res.status(406).send({ status: "error", paiload: "Complete todos los campos" });
    } else {
        res.status(201).send({ status: "success", paiload: "Producto agregado" });
    }
});

router.put("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);
    const mods = req.body;
    if ("id" in mods) {
        delete mods.id;
    }
    const data = await manager.updateProduct(id, mods);
    if (data == 406) {
        res.status(406).send({ status: "error", paiload: "El producto no existe" });
    } else {
        res.status(201).send({ status: "success", paiload: "Producto modificado" });
    }
});

router.delete("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);
    const data = await manager.deleteProduct(id);
    if (data == 406) {
        res.status(406).send({ status: "error", paiload: "El producto no existe" });
    } else {
        res.status(201).send({ status: "success", paiload: "Producto eliminado" });
    }
});

export default router;

/* import { Router } from "express";
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
export default ProductsRouter; */