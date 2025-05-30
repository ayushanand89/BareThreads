import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getOrderDetails, getOrders } from "../controllers/order.controller.js";

const router = Router();

router.get("/my-orders", verifyJWT, getOrders);
router.get("/:id", verifyJWT, getOrderDetails);

export default router;
