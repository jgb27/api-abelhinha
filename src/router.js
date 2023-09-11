import express from "express";
import { AddNewProduct, DeleteProduct, FindProductByName, FindProductByTag, GetAllProducts } from "./controller/ProductController.js";
import { Login, Authenticate } from "./controller/AuthController.js";
import { upload } from "./config/multer.js"
import { CreateUser } from "./controller/UserController.js";
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post("/login", Login);
router.post("/register", CreateUser);
router.get("/product", GetAllProducts);
router.get("/product/name/:name", FindProductByName);
router.get("/product/tag/:tag", FindProductByTag);

router.post("/verify", (req, res) => {
  const { token } = req.body;

  const verify = jwt.verify(token, process.env.AWS_SECRET_ACCESS_KEY, (error) => {
    if (error) {
      return res.status(401).json({ message: 'Token de autenticação inválido', data: false });
    } else {
      return res.status(200).json({ message: 'Token de autenticação inválido', data: true });
    }
  });

  return res.status(200).json({ token: verify })
});

router.use(Authenticate);
router.post("/product", upload.single("image"), AddNewProduct);
router.delete("/product/:id", DeleteProduct);

export default router;
