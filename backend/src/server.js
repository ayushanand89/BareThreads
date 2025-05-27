import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

//connect to MongoDB database
connectDB(); 

app.get("/", (req, res) => {
  res.send("Welcome to BareThreads API!");
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
