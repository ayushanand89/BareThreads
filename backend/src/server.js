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
import adminRoutes from "./routes/admin.routes.js";
import productAdminRoutes from "./routes/productAdmin.routes.js";
import orderAdminRoutes from "./routes/adminOrder.routes.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend dev server
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

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api", subscriberRoutes);
app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/products", productAdminRoutes);
app.use("/api/admin/orders", orderAdminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
