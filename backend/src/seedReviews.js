import "dotenv/config";
import mongoose from "mongoose";
import { Product } from "./models/product.model.js";
import { User } from "./models/user.model.js";
import { Review } from "./models/review.model.js";
import { reviewers, buildReviewsForProduct } from "./data/reviewData.js";

// Non-destructive: keeps existing products and carts, only (re)seeds
// reviewer users + reviews and recomputes each product's rating.
const seedReviews = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const products = await Product.find({});
    if (!products.length) {
      console.log("No products found. Run `npm run seed` first.");
      process.exit(1);
    }

    // Refresh reviews only
    await Review.deleteMany();
    console.log("Cleared existing reviews");

    // Find-or-create reviewer users
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

    const allReviews = [];
    for (const product of products) {
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
    console.log(
      `Inserted ${allReviews.length} reviews across ${products.length} products`
    );
    console.log("✅ Reviews seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding reviews:", error);
    process.exit(1);
  }
};

seedReviews();
