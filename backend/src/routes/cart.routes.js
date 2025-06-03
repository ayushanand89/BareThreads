import { Router } from "express";
import {
  addToCart,
  getCartInfo,
  mergeCart,
  removeProduct,
  updateQuantity,
} from "../controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", addToCart);
router.put("/", updateQuantity);
router.post("/delete", removeProduct);
router.get("/", getCartInfo);

// merging guest cart into user cart on login
router.post("/merge", verifyJWT, mergeCart);

export default router;
