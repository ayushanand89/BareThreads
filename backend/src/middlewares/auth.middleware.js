import "dotenv/config";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

//Middleware to protect routes
export const verifyJWT = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies?.AccessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decodedToken?._id).select("-password");

  if (!user) {
    throw new ApiError(401, "Invalid Access Token");
  }

  req.user = user;
  next();
});

// Middleware to check if the user is an admin
export const isAdmin = asyncHandler(async (req, _, next) => {
  if (req.user && req.user.role === "admin") {
    next(); 
  } else{
    throw new ApiError(403, "Forbidden: Admins only");
  }
});
