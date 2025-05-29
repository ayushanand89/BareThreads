import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    discountPrice,
    countInStock,
    sku,
    category,
    brand,
    size,
    colors,
    collections,
    material,
    gender,
    images,
    isFeatured,
    isPublished,
    tags,
    dimensions,
    weight,
  } = req.body;

  const product = await Product.create({
    name,
    description,
    price,
    discountPrice,
    countInStock,
    sku,
    category,
    brand,
    size,
    colors,
    collections,
    material,
    gender,
    images,
    isFeatured,
    isPublished,
    tags,
    dimensions,
    weight,
    user: req.user._id, // Reference to the admin user who created the product
  });

  if (!product) {
    throw new ApiError(500, "Failed to create product");
  }

  res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(400, "Product doesn't exist");
  }

  // Update only fields provided in the request body
  Object.keys(req.body).forEach((key) => {
    product[key] = req.body[key];
  });

  const updatedProduct = await product.save();

  res
    .status(200)
    .json(new ApiResponse(200, updatedProduct, "Product updated successfully"));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, "Could not find product");
  }

  await product.deleteOne();
  res.status(200).json(new ApiResponse(200, null, "Product removed"));
});

export { createProduct, updateProduct, deleteProduct };
