import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";
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

app.get("/", (req, res) => {
  res.send("Welcome to BareThreads API!");
});

// Lightweight health check — tries to connect so it reflects real status.
app.get("/health", async (req, res) => {
  try {
    await connectDB();
    res.json({ status: "ok", db: "connected" });
  } catch {
    res.status(503).json({ status: "ok", db: "down" });
  }
});

// Ensure the DB connection is established BEFORE handling API routes. Awaiting
// here (rather than checking a flag) is what makes this work on serverless:
// the connection completes within the request instead of being frozen at boot.
app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(503).json({
      success: false,
      message:
        "Database unavailable. Check MONGO_URI and Atlas network access.",
      errors: [err.message],
    });
  }
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

// Only start a long-running listener when NOT on Vercel (local/other hosts).
// On Vercel the exported app is invoked as a serverless function instead.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
  });
}

export default app;
