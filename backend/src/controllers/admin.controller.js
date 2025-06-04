import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  if (!users) {
    throw new ApiError(404, "Could not find users");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
});

const addUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email and password are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || "customer",
  });

  if (!user) {
    throw new ApiError(400, "Couldn't create user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User created successfully"));
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(400, "Could not find user");
  }
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.role = req.body.role || user.role;

  const updatedUser = await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, updateUser, "User updated successfully"));
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(400, "User doesn't exist");
  }

  await user.deleteOne();
  return res
    .status(200)
    .json(new ApiResponse(200, null, "User removed successfully"));
});

export { getUsers, addUser, updateUser, deleteUser };
