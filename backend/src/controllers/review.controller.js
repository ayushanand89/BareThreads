import mongoose from "mongoose";
import { Review } from "../models/review.model.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Recompute a product's aggregate rating + review count from its reviews
const recalcProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: "$product",
        avg: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const rating = stats[0] ? Math.round(stats[0].avg * 10) / 10 : 0;
  const numReviews = stats[0] ? stats[0].count : 0;

  await Product.findByIdAndUpdate(productId, { rating, numReviews });
  return { rating, numReviews };
};

// GET /api/reviews/:productId — list reviews for a product (public)
const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const reviews = await Review.find({ product: productId }).sort({
    createdAt: -1,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, reviews, "Reviews fetched successfully"));
});

// POST /api/reviews/:productId — create or update the user's review (auth)
const createReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { rating, title, comment } = req.body;

  const numericRating = Number(rating);
  if (!numericRating || numericRating < 1 || numericRating > 5) {
    throw new ApiError(400, "Rating must be a number between 1 and 5");
  }
  if (!comment || !comment.trim()) {
    throw new ApiError(400, "Review comment is required");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Upsert: one review per user per product (editing replaces the old one)
  const review = await Review.findOneAndUpdate(
    { product: productId, user: req.user._id },
    {
      product: productId,
      user: req.user._id,
      name: req.user.name,
      rating: numericRating,
      title: title?.trim() || "",
      comment: comment.trim(),
    },
    { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
  );

  const agg = await recalcProductRating(productId);

  return res
    .status(201)
    .json(
      new ApiResponse(201, { review, ...agg }, "Review submitted successfully")
    );
});

// DELETE /api/reviews/:reviewId — delete own review (or admin) (auth)
const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  const review = await Review.findById(reviewId);
  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  if (
    review.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "Not authorized to delete this review");
  }

  const productId = review.product;
  await review.deleteOne();

  const agg = await recalcProductRating(productId);

  return res
    .status(200)
    .json(new ApiResponse(200, agg, "Review deleted successfully"));
});

export { getProductReviews, createReview, deleteReview };
