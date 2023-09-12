import express from "express";
import { addNewProduct, deleteProduct, findProductByName, findProductByTag, getAllProducts } from "./controller/ProductController.js";
import { Login, Authenticate } from "./controller/AuthController.js";
import { upload } from "./config/multer.js"
import { createUser, findUserById } from "./controller/UserController.js";
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post("/login", Login);
router.post("/register", createUser);
router.get("/product", getAllProducts);
router.get("/product/name/:name", findProductByName);
router.get("/product/tag/:tag", findProductByTag);
router.get("/user/:id", findUserById);

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
router.post("/product", upload.single("image"), addNewProduct);
router.delete("/product/:id", deleteProduct);

export default router;
