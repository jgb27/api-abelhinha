import express from "express";
import { AddNewProduct, DeleteProduct, GetAllProducts } from "./controller/ProductController.js";
import { upload } from "./config/multer.js"

const router = express.Router();

router.get("/product", GetAllProducts);

router.post("/product", upload.single("image"), AddNewProduct);

router.delete("/product/:id", DeleteProduct);

router.post("/access", (req, res) => {
  res.status(200).send("Tudo certo");
});

export default router;
