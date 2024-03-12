import { Router } from "express";
import { getDeliveries, createDelivery } from "../controllers/deliveryController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);
router.get("/", getDeliveries);
router.post("/", createDelivery);

export default router;
