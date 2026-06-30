import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createReview,
  deleteReview,
  getProductReviews,
} from "../controllers/review.controller.js";

const router = Router();

router.get("/:productId", getProductReviews);
router.post("/:productId", verifyJWT, createReview);
router.delete("/:reviewId", verifyJWT, deleteReview);

export default router;
