import "dotenv/config";
import mongoose from "mongoose";
import { Product } from "./models/product.model.js";
import { User } from "./models/user.model.js";
import { products } from "../data/products.js";
import { Cart } from "./models/cart.model.js";
import { Review } from "./models/review.model.js";
import { reviewers, buildReviewsForProduct } from "./data/reviewData.js";

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Product.deleteMany();
    await Cart.deleteMany();
    await Review.deleteMany();
    console.log("Existing products, carts and reviews deleted");

    // Default admin user
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

    // Insert products
    const sampleProducts = products.map((product) => ({
      ...product,
      user: userID,
      rating: 0,
      numReviews: 0,
    }));
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`Inserted ${insertedProducts.length} products`);

    // Find-or-create dummy reviewer users
    const reviewerDocs = [];
    for (const r of reviewers) {
      let u = await User.findOne({ email: r.email });
      if (!u) {
        u = await User.create({
          name: r.name,
          email: r.email,
          password: "123456",
          role: "customer",
        });
      }
      reviewerDocs.push(u);
    }
    console.log(`Prepared ${reviewerDocs.length} reviewer users`);

    // Generate reviews for each product
    const allReviews = [];
    for (const product of insertedProducts) {
      const productReviews = buildReviewsForProduct(product._id, reviewerDocs);
      allReviews.push(...productReviews);

      const avg =
        productReviews.reduce((sum, r) => sum + r.rating, 0) /
        productReviews.length;
      await Product.findByIdAndUpdate(product._id, {
        rating: Math.round(avg * 10) / 10,
        numReviews: productReviews.length,
      });
    }

    await Review.insertMany(allReviews);
    console.log(`Inserted ${allReviews.length} reviews`);

    console.log("✅ Data seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
