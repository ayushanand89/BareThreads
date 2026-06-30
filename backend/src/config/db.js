import mongoose from "mongoose";

// Fail fast instead of buffering commands for 10s when the DB is down,
// so API requests return a clear error rather than hanging.
mongoose.set("bufferTimeoutMS", 5000);

let isConnected = false;
let retrying = false;

export const isDBConnected = () => isConnected;

const attachListeners = () => {
  mongoose.connection.on("disconnected", () => {
    isConnected = false;
    console.warn("⚠️  MongoDB disconnected — will keep retrying...");
    scheduleReconnect();
  });
  mongoose.connection.on("reconnected", () => {
    isConnected = true;
    console.log("✅ MongoDB reconnected");
  });
};

const tryConnect = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 8000,
  });
  isConnected = true;
};

// Background reconnect loop — keeps attempting until the DB is reachable
// (e.g. after an Atlas cluster is resumed) so the server self-heals without
// needing a manual restart.
const scheduleReconnect = () => {
  if (retrying || isConnected) return;
  retrying = true;

  const loop = async () => {
    while (!isConnected) {
      await new Promise((r) => setTimeout(r, 5000));
      try {
        await tryConnect();
        console.log("✅ MongoDB connected (recovered)");
      } catch (error) {
        console.error(`🔁 Reconnect attempt failed: ${error.message}`);
      }
    }
    retrying = false;
  };
  loop();
};

export const connectDB = async () => {
  try {
    await tryConnect();
    attachListeners();
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error(`❌ Initial MongoDB connection failed: ${error.message}`);
    console.error(
      "\n──────────────────────────────────────────────────────────────\n" +
        "  Could not connect to MongoDB yet. The API is running and will\n" +
        "  keep retrying in the background every 5s. DB routes return 503\n" +
        "  until a connection is established.\n\n" +
        "  Common causes:\n" +
        "   • MONGO_URI is wrong, or the Atlas cluster is paused\n" +
        "   • Your current IP is not whitelisted in Atlas Network Access\n" +
        "   • No internet / DNS cannot resolve the SRV record\n" +
        "──────────────────────────────────────────────────────────────\n"
    );
    attachListeners();
    scheduleReconnect();
  }
};
