import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      "Please enter a valid email address",
    ],
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Subscriber = mongoose.model("Subscriber", subscriberSchema);
