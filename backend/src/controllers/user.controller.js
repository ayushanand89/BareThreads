import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import "dotenv/config";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateToken } from "../utils/generateToken.js";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Shared cookie options for the JWT (cross-site, https-only)
const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  maxAge: 24 * 60 * 60 * 1000, // 1 day (matches token expiry)
};

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
    sameSite: "None", // Use 'None' for cross-site cookies
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
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

  // Google-only accounts have no password to compare against
  if (!user.password) {
    throw new ApiError(
      400,
      "This account uses Google sign-in. Please continue with Google."
    );
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
    sameSite: "None", // Use 'None' for cross-site cookies
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds (matches token expiry)
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



// Sign in / register with a Google ID token (from the frontend GoogleLogin button)
const googleAuth = asyncHandler(async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    throw new ApiError(400, "Google credential is required");
  }

  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new ApiError(500, "Google sign-in is not configured on the server");
  }

  // Verify the ID token with Google
  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch {
    throw new ApiError(401, "Invalid Google credential");
  }

  if (!payload?.email || !payload.email_verified) {
    throw new ApiError(401, "Google account email is not verified");
  }

  const { sub: googleId, email, name, picture } = payload;

  // Find by email (link existing accounts) or create a new Google user
  let user = await User.findOne({ email });

  if (user) {
    let changed = false;
    if (!user.googleId) {
      user.googleId = googleId;
      changed = true;
    }
    if (!user.avatar && picture) {
      user.avatar = picture;
      changed = true;
    }
    if (changed) {
      await user.save({ validateBeforeSave: false });
    }
  } else {
    user = await User.create({
      name: name || email.split("@")[0],
      email,
      googleId,
      provider: "google",
      avatar: picture,
      role: "customer",
    });
  }

  const token = generateToken({ _id: user._id, role: user.role });

  res
    .status(200)
    .cookie("AccessToken", token, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
          },
          token,
        },
        "Signed in with Google successfully"
      )
    );
});

export { registerUser, loginUser, googleAuth };
