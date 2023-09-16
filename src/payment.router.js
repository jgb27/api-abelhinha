import { Router } from "express";
import { CreateOrder, WebHook } from "./controller/PaymentController.js";

const router = Router();

router.post("/create-order", CreateOrder)

router.get("/success", (req, res) => res.status(200).send('success'));

router.get("pending", (req, res) => res.status(200).send('pending'));

router.get("/failure", (req, res) => res.status(200).send('failure'));

router.post("/webhook", WebHook);

export default router;
