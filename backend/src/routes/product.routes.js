import { Router } from "express";
import { isAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { createProduct, deleteProduct, updateProduct } from "../controllers/product.controller.js";

const router = Router();

router.post("/", verifyJWT, isAdmin, createProduct);
router.put("/:id", verifyJWT, isAdmin, updateProduct);
router.delete("/:id", verifyJWT, isAdmin, deleteProduct); 
export default router;
