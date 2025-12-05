import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
import productRoutes from "./routes/productRoutes.js";
app.use("/api/products", productRoutes);

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
