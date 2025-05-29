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

const getAllProducts = asyncHandler(async (req, res) => {
  const {
    collection,
    size,
    color,
    gender,
    minPrice,
    maxPrice,
    sortBy,
    search,
    category,
    material,
    brand,
    limit,
  } = req.query;

  let query = {};

  // Filter logic
  if (collection && collection.toLocaleLowerCase() !== "all") {
    query.collections = collection;
  }

  if (category && category.toLocaleLowerCase() !== "all") {
    query.category = category;
  }

  if (material) {
    query.material = { $in: material.split(",") };
  }
  if (brand) {
    query.brand = { $in: brand.split(",") };
  }
  if (size) {
    query.sizes = { $in: size.split(",") };
  }
  if (color) {
    query.colors = { $in: [color] };
  }

  if (gender) {
    query.gender = gender;
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Sort Logic
  let sort = {};
  if (sortBy) {
    switch (sortBy) {
      case "priceAsc":
        sort = { price: 1 };
        break;

      case "priceDesc":
        sort = { price: -1 };
        break;

      case "popularity":
        sort = { rating: -1 };
        break;

      default:
        break;
    }
  }

  // Fetch products and apply sorting and limit
  let products = await Product.find(query)
    .sort(sort)
    .limit(Number(limit) || 0);

  if (!products) {
    throw new ApiError(500, "Server Error");
  }

  res
    .status(200)
    .json(new ApiResponse(200, products, "products fetched successfully"));
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(500, "Could not find product");
  }

  res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});

const getSimilarProducts = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  const similarProducts = await Product.find({
    _id: { $ne: id }, // Exclude the current product
    gender: product.gender, // Match
    category: product.category, // Match the same category
  }).limit(4); // Limit to 4 similar products

  if (!similarProducts) {
    throw new ApiError(500, "Could not fetch similar products");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        similarProducts,
        "Similar products fetched successfully"
      )
    );
});

const getBestSeller = asyncHandler(async (req, res) => {
  const bestSeller = await Product.findOne().sort({ rating: -1 });

  if (!bestSeller) {
    throw new ApiError(404, "No best seller found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, bestSeller, "Best seller fetched successfully"));
});

const getNewArrivals = asyncHandler(async (req, res) => {
  const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);

  if (!newArrivals) {
    throw new ApiError(404, "No new arrivals found");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, newArrivals, "New arrivals fetched successfully")
    );
});

export {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  getSimilarProducts,
  getBestSeller,
  getNewArrivals,
};
