import express from "express";
import { addNewProduct, deleteProduct, findProductByName, findProductByTag, getAllProducts } from "./controller/ProductController.js";
import { Login, Authenticate, AuthenticateCommonUser } from "./controller/AuthController.js";
import { upload } from "./config/multer.js"
import { createUser, deleteUser, getAllUser, getProductByUser, getUser } from "./controller/UserController.js";
import { CreateOrder } from "./controller/PaymentController.js";
import { WebHook } from "./controller/Webhook.js";

import jwt from 'jsonwebtoken';

const router = express.Router();

router.post("/login", Login);
router.post("/register", createUser);
router.get("/products", getAllProducts);
router.get("/product/name/:name", findProductByName);
router.get("/product/tag/:tag", findProductByTag);
router.post("/webhook", WebHook);

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

router.use(AuthenticateCommonUser)
router.get("/product", getProductByUser)
router.get("/user", getUser);

router.post("/create-order", CreateOrder)

router.use(Authenticate);
router.post("/product", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), addNewProduct);
router.delete("/product/:id", deleteProduct);

router.get("/users", getAllUser);
router.delete("/users/:id", deleteUser);

export default router;
