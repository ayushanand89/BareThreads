import { Router } from "express";
import { handleSubscription } from "../controllers/subscriber.controller.js";

const router = Router();

router.post("/subscribe", handleSubscription);

export default router;
