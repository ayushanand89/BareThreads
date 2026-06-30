import { Router } from "express";
import "dotenv/config";
import {
  loginUser,
  registerUser,
  googleAuth,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = Router();

// @route POST /api/user/register
// @desc Register a new user
// @access Public
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);
router.get("/profile", verifyJWT, async(req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, req.user, "User profile fetched successfully"));

}); 

export default router;
