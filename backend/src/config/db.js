import mongoose from "mongoose";

// Cache the connection across warm serverless invocations so we don't open a
// new connection on every request (and so a pending connection survives).
let cached = global._mongooseConn;
if (!cached) {
  cached = global._mongooseConn = { conn: null, promise: null };
}

export const isDBConnected = () => mongoose.connection.readyState === 1;

/**
 * Establish (or reuse) the MongoDB connection.
 *
 * Critically, this is meant to be AWAITED inside the request lifecycle. On
 * serverless platforms (Vercel) the function freezes the instant a response is
 * sent, so a fire-and-forget connection started at boot never finishes — the
 * connection must complete while a request is still in flight.
 */
export const connectDB = async () => {
  if (cached.conn && isDBConnected()) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
      })
      .then((m) => {
        console.log("✅ MongoDB connected");
        return m;
      })
      .catch((err) => {
        // Reset so the next request can retry instead of caching a failure.
        cached.promise = null;
        console.error("❌ MongoDB connection failed:", err.message);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
