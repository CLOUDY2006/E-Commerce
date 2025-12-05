import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: [
      "https://e-commerce-e87k.vercel.app/", // your deployed frontend
      "http://localhost:5173", // local development
      "http://localhost:3000"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

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
