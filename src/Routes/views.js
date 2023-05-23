import express from "express";
import { manager } from "../Managers/ProductManager.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const data = await manager.getProducts();
    if (data) {
        res.render("home", { data, style: 'style.css' });
    }
});

router.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts", {
        style: 'style.css'
    });
});

export default router;