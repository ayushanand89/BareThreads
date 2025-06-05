import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import "dotenv/config";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateToken } from "../utils/generateToken.js";
import e from "express";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if ([name, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (!user) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  const token = generateToken({ _id: user._id, role: user.role });

  if (!token) {
    throw new ApiError(500, "Token generation failed");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(201)
    .cookie("AccessToken", token, options)
    .json(
      new ApiResponse(
        201,
        {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        },
        "User and Token generated successfully!"
      )
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "username and email are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.matchPassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const token = generateToken({ _id: user._id, role: user.role });
  if (!token) {
    throw new ApiError(500, "Error while generating token");
  }

  const options = {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
  };

  res
    .status(200)
    .cookie("AccessToken", token, options)
    .json(
      new ApiResponse(
        200,
        {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        },
        "User logged in successfully"
      )
    );
}); 



export { registerUser, loginUser };
