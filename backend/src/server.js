import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB, isDBConnected } from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import checkoutRoutes from "./routes/checkout.routes.js";
import orderRoutes from "./routes/order.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import subscriberRoutes from "./routes/subscriber.route.js";
import reviewRoutes from "./routes/review.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import productAdminRoutes from "./routes/productAdmin.routes.js";
import orderAdminRoutes from "./routes/adminOrder.routes.js";
import cookieParser from "cookie-parser";
import { ApiError } from "./utils/ApiError.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // frontend dev server
    credentials: true, // MUST be true to allow cookies
  })
);
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

//connect to MongoDB database
connectDB();

app.get("/", (req, res) => {
  res.send("Welcome to BareThreads API!");
});

// Lightweight health check (does not require the DB)
app.get("/health", (req, res) => {
  res.json({ status: "ok", db: isDBConnected() ? "connected" : "down" });
});

// Guard DB-backed API routes: if MongoDB is unavailable, return a clear
// 503 instead of letting requests hang or fail opaquely.
app.use("/api", (req, res, next) => {
  if (!isDBConnected()) {
    return res.status(503).json({
      success: false,
      message:
        "Database unavailable. Check the backend MongoDB connection (see server logs).",
      errors: [],
    });
  }
  next();
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api", subscriberRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/products", productAdminRoutes);
app.use("/api/admin/orders", orderAdminRoutes);

// 404 fallback for unmatched routes
app.use((req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
});

// Global error handler — returns a consistent JSON shape for all errors
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
