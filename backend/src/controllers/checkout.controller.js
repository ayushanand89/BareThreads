import { Checkout } from "../models/checkout.model.js";
import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create new checkout session
const createCheckout = asyncHandler(async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } =
    req.body;

  // Basic validations
  if (
    !checkoutItems ||
    !Array.isArray(checkoutItems) ||
    checkoutItems.length === 0
  ) {
    throw new ApiError(400, "No items in checkout");
  }

  if (!shippingAddress || typeof shippingAddress !== "object") {
    throw new ApiError(400, "Shipping address is required");
  }

  if (!paymentMethod || typeof paymentMethod !== "string") {
    throw new ApiError(400, "Payment method is required");
  }

  if (!totalPrice || typeof totalPrice !== "number") {
    throw new ApiError(400, "Total price must be a number");
  }

  const newCheckout = await Checkout.create({
    user: req.user._id,
    checkoutItems,
    shippingAddress,
    paymentMethod,
    totalPrice,
    paymentStatus: "Pending",
    isPaid: false,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, newCheckout, "New checkout created successfully")
    );
});

// Update checkout to mark as paid after successful payment
const updateCheckout = asyncHandler(async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body;

  const checkout = await Checkout.findById(req.params.id);

  if (!checkout) {
    throw new ApiError(404, "Checkout not found");
  }

  if (!paymentStatus || typeof paymentStatus !== "string") {
    throw new ApiError(400, "Payment status is required and must be a string");
  }

  if (paymentStatus.toLowerCase() === "paid") {
    checkout.isPaid = true;
    checkout.paymentStatus = "Paid";
    checkout.paymentDetails = paymentDetails || {};
    checkout.paidAt = Date.now();

    await checkout.save();

    return res
      .status(200)
      .json(new ApiResponse(200, checkout, "Checkout updated successfully"));
  } else {
    throw new ApiError(400, "Invalid payment status. Only 'paid' is accepted");
  }
});

const confirmCheckout = asyncHandler(async (req, res) => {
  const checkout = await Checkout.findById(req.params.id);

  if (!checkout) {
    throw new ApiError(404, "Checkout not found");
  }

  if (checkout.isFinalized) {
    throw new ApiError(400, "Checkout already finalized");
  }

  if (!checkout.isPaid) {
    throw new ApiError(400, "Checkout is not paid yet");
  }

  // Create final order based on checkout details
  const finalOrder = await Order.create({
    user: checkout.user,
    orderItems: checkout.checkoutItems, // correct field from your Checkout model
    shippingAddress: checkout.shippingAddress,
    paymentMethod: checkout.paymentMethod,
    totalPrice: checkout.totalPrice,
    isPaid: true,
    paidAt: checkout.paidAt,
    isDelivered: false,
    paymentStatus: checkout.paymentStatus,
    paymentDetails: checkout.paymentDetails,
  });

  if (!finalOrder) {
    throw new ApiError(500, "Failed to create order from checkout");
  }

  // Mark the checkout as finalized
  checkout.isFinalized = true;
  checkout.finalizedAt = Date.now();
  await checkout.save();

  // Delete cart (optional: only for logged-in users)
  if (checkout.user) {
    await Cart.findOneAndDelete({ user: checkout.user });
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        finalOrder,
        "Order created and checkout finalized successfully"
      )
    );
});

export { createCheckout, updateCheckout, confirmCheckout };
