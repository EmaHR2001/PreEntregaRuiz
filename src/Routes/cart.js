import { manager } from "../Managers/CartManager.js";
import { manager as pManager } from "../Managers/ProductManager.js";
import { Router } from "express";

const router = Router();

router.post("/", async (req, res) => {
    const data = await manager.addCart();
    if (data == 201) {
        res.status(201).send({ status: "success", paiload: "Carrito agregado" });
    } else {
        res
            .status(406)
            .send({ status: "error", paiload: "No se pudo agregar el carrito" });
    }
});

router.get("/:cid", async (req, res) => {
    const cid = parseInt(req.params.cid);
    const data = await manager.getCartById(cid);
    if (data == "406a") {
        res.status(406).send({ status: "error", paiload: "No hay carritos" });
    } else if (data == "406b") {
        res.status(406).send({ status: "error", paiload: "No existe el carrito" });
    } else {
        res.send({ status: "success", paiload: data.products });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);
    const productData = await pManager.getProductById(pid);
    if (productData == "406a") {
        res.status(406).send({ status: "error", paiload: "No hay productos" });
    } else if (productData == "406b") {
        res.status(406).send({ status: "error", paiload: "No existe el producto" });
    } else {
        const cartData = await manager.getCartById(cid);
        if (cartData == "406a") {
            res.status(406).send({ status: "error", paiload: "No hay carritos" });
        } else if (cartData == "406b") {
            res.status(406).send({ status: "error", paiload: "No existe el carrito" });
        } else {
            await manager.addProduct(cid, pid);
            res.status(201).send({ status: "success", paiload: "Producto agregado" });
        }
    }
});

export default router;


/* import { Router } from "express";
import CartManager from "../Managers/CartManager.js";

const CartRouter = Router();

let manager = new CartManager;

CartRouter.post("/", async (req, res) => {
    let newCart = await manager.createCart();
    res.send(!newCart)
});

CartRouter.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    const cart = await manager.getCart(cartId);
    if (!cart) {
        res.status(404).send({ status: "error", msg: "Cart not found" });
    }
    res.send(cart.products);
});

CartRouter.post("/:cid/products/:pid", async (req, res) => {
    let cartId = req.params.cid;
    let productId = req.params.pid;
    let addProduct = await manager.AddProductToCart(cartId, productId)
    if (!addProduct) {
        res.status(404).send({ status: "error", msg: "Product not added" })
    }
    res.send({ status: "success", msg: "Added Product" })
})

export default CartRouter; */