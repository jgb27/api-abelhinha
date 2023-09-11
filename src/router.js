import express from "express";
import { AddNewProduct, DeleteProduct, GetAllProducts } from "./controller/ProductController.js";
import { Login, Authenticate } from "./controller/AuthController.js";
import { upload } from "./config/multer.js"
import { CreateUser } from "./controller/UserController.js";
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post("/login", Login);
router.get("/product", GetAllProducts);

router.post("/verify", (req, res) => {
  const { token } = req.body;

  const verify = jwt.verify(token, process.env.AWS_SECRET_ACCESS_KEY, (error, decodedToken) => {
    if (error) {
      return res.status(401).json({ message: 'Token de autenticação inválido' });
    } else {
      return true
    }
  });

  return res.status(200).json({ token: verify })
});

router.post("/register", CreateUser);

router.use(Authenticate);
router.post("/product", upload.single("image"), AddNewProduct);
router.delete("/product/:id", DeleteProduct);

router.post("/access", (req, res) => {
  res.status(200).send("Tudo certo");
});

export default router;
