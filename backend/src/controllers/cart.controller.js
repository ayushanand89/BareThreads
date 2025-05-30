import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getCart = async (userId, guestId) => {
  if (userId) {
    return await Cart.findOne({ user: userId });
  } else if (guestId) {
    return await Cart.findOne({ guestId });
  }
  return null;
};

// add a product to the cart for a guest or logged in user
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  if (!productId || !quantity || !size || !color) {
    throw new ApiError(400, "Missing required cart fields");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  //Determine if the user is logged in or a guest
  let cart = await getCart(userId, guestId);

  // If the cart exits, update it
  if (cart) {
    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex > -1) {
      // If the product already exists, update the quantity
      cart.products[productIndex].quantity += quantity;
    } else {
      // add new product
      cart.products.push({
        productId,
        name: product.name,
        image: product.images[0].url,
        price: product.price,
        size,
        color,
        quantity,
      });
    }

    // Recalculate the total price
    cart.totalPrice = cart.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    await cart.save();
    return res
      .status(200)
      .json(new ApiResponse(200, cart, "Cart Updated Successfully"));
  } else {
    // create a new cart for the guest or user
    const newCart = await Cart.create({
      user: userId ? userId : undefined,
      guestId: guestId ? guestId : "guest_" + new Date().getTime(),
      products: [
        {
          productId,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          size,
          color,
          quantity,
        },
      ],
      totalPrice: product.price * quantity,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, newCart, "Cart Created Successfully"));
  }
});

// update product quantity in the cart for a guest or logged-in user
const updateQuantity = asyncHandler(async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  // Validate input
  if (!productId || !size || !color || typeof quantity !== "number") {
    throw new ApiError(400, "Missing or invalid required fields");
  }

  // Find the user's cart
  const cart = await getCart(userId, guestId);
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  // Find the product in the cart
  const productIndex = cart.products.findIndex(
    (p) =>
      p.productId.toString() === productId &&
      p.size === size &&
      p.color === color
  );

  if (productIndex === -1) {
    throw new ApiError(404, "Product not found in cart");
  }

  if (quantity > 0) {
    cart.products[productIndex].quantity = quantity;
  } else {
    cart.products.splice(productIndex, 1); // Remove product if quantity is 0
  }

  // Recalculate total price
  cart.totalPrice = cart.products.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart updated successfully"));
});

// removing a product in cart for a guest or logged-in user
const removeProduct = asyncHandler(async (req, res) => {
  const { productId, size, color, guestId, userId } = req.body;

  // Validate input
  if (!productId || !size || !color) {
    throw new ApiError(400, "Missing required fields");
  }

  // Get user's cart
  const cart = await getCart(userId, guestId);

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  // Find product in cart
  const productIndex = cart.products.findIndex(
    (p) =>
      p.productId.toString() === productId &&
      p.size === size &&
      p.color === color
  );

  if (productIndex === -1) {
    throw new ApiError(404, "Product not found in cart");
  }

  // Remove product
  cart.products.splice(productIndex, 1);

  // Recalculate total price
  cart.totalPrice = cart.products.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Product removed from cart"));
});

// Get logged-in user's or guest's cart
const getCartInfo = asyncHandler(async (req, res) => {
  const { userId, guestId } = req.query;

  // Validate input
  if (!userId && !guestId) {
    throw new ApiError(400, "User ID or Guest ID is required");
  }

  // Fetch cart
  const cart = await getCart(userId, guestId);

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart fetched successfully"));
});

// Merge guest cart into user cart on login
const mergeCart = asyncHandler(async (req, res) => {
  const { guestId } = req.body;

  if (!guestId) {
    throw new ApiError(400, "Guest ID is required");
  }

  const guestCart = await Cart.findOne({ guestId });
  const userCart = await Cart.findOne({ user: req.user._id });

  // If no guest cart found, nothing to merge
  if (!guestCart || guestCart.products.length === 0) {
    throw new ApiError(404, "Guest cart is empty or not found");
  }

  // If user has an existing cart, merge products
  if (userCart) {
    guestCart.products.forEach((guestItem) => {
      const existingIndex = userCart.products.findIndex(
        (item) =>
          item.productId.toString() === guestItem.productId.toString() &&
          item.size === guestItem.size &&
          item.color === guestItem.color
      );

      if (existingIndex > -1) {
        // Merge quantities if product already exists
        userCart.products[existingIndex].quantity += guestItem.quantity;
      } else {
        // Add new item to user's cart
        userCart.products.push(guestItem);
      }
    });

    // Recalculate total
    userCart.totalPrice = userCart.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await userCart.save();
    await guestCart.deleteOne(); // remove guest cart after merge

    return res
      .status(200)
      .json(new ApiResponse(200, userCart, "Cart merged successfully"));
  }

  // If user has no existing cart, just assign guest cart to user
  guestCart.user = req.user._id;
  guestCart.guestId = undefined;

  await guestCart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, guestCart, "Guest cart assigned to user"));
});

export { addToCart, updateQuantity, removeProduct, getCartInfo, mergeCart };
