import { Router } from "express";
import { isAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = Router();

// get all products
router.get(
  "/",
  verifyJWT,
  isAdmin,
  asyncHandler(async (req, res) => {
    const products = await Product.find({});
    if (!products) {
      throw new ApiError(500, "Could not find products");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, products, "Products fetched successfully"));
  })
);

export default router;
