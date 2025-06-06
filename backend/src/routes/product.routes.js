import { Router } from "express";
import { isAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getBestSeller,
  getNewArrivals,
  getProduct,
  getSimilarProducts,
  updateProduct,
} from "../controllers/product.controller.js";

const router = Router();

router.post("/", verifyJWT, isAdmin, createProduct);
router.put("/:id", verifyJWT, isAdmin, updateProduct);
router.delete("/:id", verifyJWT, isAdmin, deleteProduct);
router.get("/", getAllProducts);
router.get("/best-seller", getBestSeller);
router.get("/new-arrivals", getNewArrivals); 
router.get("/:id", getProduct);
router.get("/similar/:id", getSimilarProducts);


export default router;
