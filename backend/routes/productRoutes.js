import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// 🟩 GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    // Convert _id → id
    const formatted = products.map(product => ({
      id: product._id,
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🟦 ADD product
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();

    // Return with id instead of _id
    res.json({
      id: saved._id,
      name: saved.name,
      price: saved.price,
      description: saved.description,
      image: saved.image
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 🟧 UPDATE product
router.put("/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json({
      id: updated._id,
      name: updated.name,
      price: updated.price,
      description: updated.description,
      image: updated.image
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 🟥 DELETE product
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
