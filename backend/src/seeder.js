import "dotenv/config";
import mongoose from "mongoose";
import { Product } from "./models/product.model.js";
import { User } from "./models/user.model.js";
import { products } from "../data/products.js";
import { Cart } from "./models/cart.model.js";

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing products
    await Product.deleteMany();
    await Cart.deleteMany(); 
    console.log("Existing products deleted");

    // Create a default admin user
    let createdUser = await User.findOne({ email: "admin@example.com" });

    if (!createdUser) {
      createdUser = await User.create({
        name: "Admin User",
        email: "admin@example.com",
        password: "123456",
        role: "admin",
      });
      console.log("Admin user created");
    } else {
      console.log("Admin user already exists");
    }

    const userID = createdUser._id;
    console.log(`Using user ID: ${userID}`);

    const sampleProducts = products.map((product) => ({
      ...product, 
      user: userID,
    }));

    await Product.insertMany(sampleProducts);
    console.log("Sample products inserted");

    console.log("✅ Data seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    // You can optionally throw new ApiError(...) here, but it's more for HTTP contexts
    process.exit(1);
  }
};

seedData();
