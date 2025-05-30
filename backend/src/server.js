import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js"
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

//connect to MongoDB database
connectDB();

app.get("/", (req, res) => {
  res.send("Welcome to BareThreads API!");
});

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes); 

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
