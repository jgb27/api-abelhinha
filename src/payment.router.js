import { Router } from "express";
import { CreateOrder } from "./controller/PaymentController.js";

const router = Router();

router.get("/create-order", CreateOrder)

router.get("/success", (req, res) => res.status(200).send('success'));

router.get("pending", (req, res) => res.status(200).send('pending'));

router.get("/failure", (req, res) => res.status(200).send('failure'));

router.get("/webhook", (req, res) => res.status(200).send('webhook'));

export default router;
