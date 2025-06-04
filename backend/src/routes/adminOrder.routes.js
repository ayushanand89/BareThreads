import { Router } from "express";
import { isAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Order } from "../models/order.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const router = Router();

// Get all orders
router.get(
  "/",
  verifyJWT,
  isAdmin,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate("user", "name email");
    if (!orders) {
      throw new ApiError(404, "Could not find any orders");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, orders, "Orders fetched successfully"));
  })
);

// update order status
router.put(
  "/:id",
  verifyJWT,
  isAdmin,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    const newStatus = req.body.status;

    order.status = newStatus || order.status;

    if (newStatus === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();

    if (!updatedOrder) {
      throw new ApiError(500, "Failed to update order");
    }

    res
      .status(200)
      .json(new ApiResponse(200, updatedOrder, "Order updated successfully"));
  })
);

// delete an order
router.delete(
  "/:id",
  verifyJWT,
  isAdmin,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    await order.deleteOne();
    return res.status(200).json(new ApiResponse(200, null, "Order removed"));
  })
);

export default router;
