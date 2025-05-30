import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { confirmCheckout, createCheckout, updateCheckout } from "../controllers/checkout.controller.js";

const router = Router(); 

router.post("/", verifyJWT, createCheckout); 
router.put("/", verifyJWT, updateCheckout); 
router.post("/:id/finalize", verifyJWT, confirmCheckout); 

export default router; 