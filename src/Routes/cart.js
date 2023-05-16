import { Router } from "express";
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

export default CartRouter;