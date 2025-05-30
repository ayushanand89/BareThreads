import { Order } from "../models/order.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get logged-in user's orders
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  }); // sort by most recent orders

  if (!orders) {
    throw new ApiError(404, "Couldn't find any orders");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders Fetched Successfully"));
});

// Get order details by id
const getOrderDetails = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    throw new ApiError(404, "Order Not Found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order fetched Successfully"));
});

export { getOrders, getOrderDetails };
